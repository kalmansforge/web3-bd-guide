#!/bin/bash

# Script to add a new template to the application
# Usage: ./add_template.sh <template_name>

# Check if template name is provided
if [ -z "$1" ]; then
  echo "Usage: ./add_template.sh <template_name>"
  exit 1
fi

TEMPLATE_NAME="$1"
TEMPLATE_ID="${TEMPLATE_NAME// /_}"
TEMPLATE_ID="${TEMPLATE_ID,,}"  # Convert to lowercase
CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# Create a new template file
cat > "src/templates/${TEMPLATE_ID}_evaluation.json" << EOF
{
  "id": "${TEMPLATE_ID}-evaluation",
  "name": "${TEMPLATE_NAME} Evaluation",
  "description": "Evaluation template for ${TEMPLATE_NAME} projects.",
  "author": "System",
  "createdAt": "${CURRENT_DATE}",
  "updatedAt": "${CURRENT_DATE}",
  "categories": [
    {
      "id": "${TEMPLATE_ID}-main",
      "name": "${TEMPLATE_NAME} Analysis",
      "description": "Primary evaluation category for ${TEMPLATE_NAME} projects",
      "metrics": [
        {
          "id": "quality",
          "name": "Quality",
          "description": "Overall quality assessment",
          "type": "scale",
          "min": 1,
          "max": 5
        },
        {
          "id": "innovation",
          "name": "Innovation",
          "description": "Level of innovation",
          "type": "scale",
          "min": 1,
          "max": 5
        }
      ]
    }
  ]
}
EOF

echo "Created new template: src/templates/${TEMPLATE_ID}_evaluation.json"
echo "Template will be automatically loaded the next time the templates view is refreshed"

# If running in Docker, copy to the container
if docker ps | grep -q "web3-bd-app"; then
  echo "Copying template to running Docker container..."
  docker cp "src/templates/${TEMPLATE_ID}_evaluation.json" web3-bd-app:/app/dist/assets/templates/
  echo "Template copied to container. It should be available in the next refresh cycle."
fi 