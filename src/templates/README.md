# Templates Directory

This directory contains all template JSON files for the Web3 Business Development Guide application. These templates are dynamically loaded by the application at runtime.

## Dynamic Template System

The application now features an enhanced template system with the following capabilities:

1. **Automatic Discovery**: Templates in this directory are automatically discovered and loaded without requiring code changes or restarts.

2. **Auto-Refresh**: The system periodically checks for new templates every minute, making new templates available without application restarts.

3. **JSON Format**: Each template is stored as a JSON file with a consistent structure (see below).

4. **Simple Template Creation**: Templates can be added by simply creating new JSON files in this directory.

## Template Structure

Each template follows this JSON structure:
```json
{
  "id": "unique_template_id",
  "name": "Template Display Name",
  "description": "Template description text",
  "author": "Author Name",
  "aiui-author": "AI Model Name",
  "createdAt": "2023-08-01T00:00:00.000Z",
  "updatedAt": "2023-08-01T00:00:00.000Z",
  "categories": [
    {
      "id": "category_id",
      "name": "Category Name",
      "description": "Category description",
      "metrics": [
        {
          "id": "metric_id",
          "name": "Metric Name",
          "description": "Metric description",
          "type": "scale",
          "min": 1,
          "max": 5
        }
        // Additional metrics...
      ]
    }
    // Additional categories...
  ]
}
```

The `aiui-author` field specifies which AI model (e.g., "Claude 3 Opus") was used to create or assist with the template creation, providing transparency about AI-generated content.

## Adding New Templates

To add a new template:

1. Create a new JSON file in this directory with a descriptive name (e.g., `my_new_template.json`)
2. Follow the template structure shown above
3. The application will automatically detect and load your new template

## Example Templates

The directory includes several example templates for different evaluation scenarios:
- Traditional finance integration
- Real-world asset management
- Decentralized exchange evaluation
- Centralized finance evaluation
- AI-powered evaluation templates for various Web3 scenarios

## Helper Script

For convenience, a helper script `add_template.sh` is available in the root directory to simplify template creation. 