# Shared Templates

This directory contains shared templates for evaluating various aspects of Web3 applications. These templates are designed to be used across different projects and teams to maintain consistency in evaluation processes.

## Structure and Usage

Each template is stored as a JSON file with the following structure:
- `id`: Unique identifier for the template
- `name`: Display name of the template
- `description`: Brief description of the template's purpose
- `author`: Creator of the template
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `categories`: Array of evaluation categories, each containing:
  - `id`: Category identifier
  - `name`: Category name
  - `description`: Category description
  - `metrics`: Array of evaluation metrics, each containing:
    - `id`: Metric identifier
    - `name`: Metric name
    - `description`: Metric description
    - `type`: Type of evaluation (e.g., "scale")
    - `min`: Minimum value
    - `max`: Maximum value

### How to Use

1. **Import Template**: Use the template ID to import the template into your evaluation system
2. **Format**: All templates use a 5-point scale (1-5) for quantitative evaluation
3. **Share**: Templates can be shared and reused across different projects

## Available Templates

### AI + Web3 Templates

1. **AI-Powered TradFi Integration**
   - Focus: Institutional integration and market bridging
   - Key Categories: Institutional Integration, Market Bridging, Risk Management, Integration Tools

2. **AI-Powered RWA Management**
   - Focus: Real World Assets tokenization and compliance
   - Key Categories: Asset Tokenization, Market Liquidity, Compliance Monitoring, Risk Assessment

3. **AI-Powered DEX Evaluation**
   - Focus: Decentralized exchange capabilities
   - Key Categories: Trading Optimization, Liquidity Management, Market Making, Security Monitoring

4. **AI-Powered CeFi Evaluation**
   - Focus: Centralized finance platform capabilities
   - Key Categories: Trading Systems, Risk Control, Compliance Systems, Customer Service

### Traditional Web3 Finance Templates

1. **TradFi Integration**
   - Focus: Traditional finance integration and bridging
   - Key Categories: Institutional Integration, Market Bridging, Risk Management, Integration Tools

2. **RWA Management**
   - Focus: Real World Assets tokenization and management
   - Key Categories: Asset Tokenization, Market Liquidity, Compliance Monitoring, Risk Assessment

3. **DEX Evaluation**
   - Focus: Decentralized exchange mechanics
   - Key Categories: Trading Mechanics, Liquidity Management, Market Making, Security Measures

4. **CeFi Evaluation**
   - Focus: Centralized finance platform capabilities
   - Key Categories: Trading Systems, Risk Control, Compliance Systems, Customer Service

## Contributing

To contribute new templates or modify existing ones:
1. Create a new JSON file following the template structure
2. Update this README with the new template information
3. Submit a pull request for review

## Best Practices

1. **Consistency**: Maintain consistent structure across all templates
2. **Clarity**: Use clear and specific descriptions for metrics
3. **Completeness**: Ensure all necessary evaluation aspects are covered
4. **Maintenance**: Keep templates updated with industry best practices 