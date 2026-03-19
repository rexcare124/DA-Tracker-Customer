# n8n Workflow Documentation

This directory contains comprehensive documentation for processing PDF organizational charts to JSON using n8n workflows. The documentation is organized into multiple HTML files for easy navigation and reference.

## Documentation Files

### 📋 [n8n_org_chart_processing_plan.html](n8n_org_chart_processing_plan.html)
**Main Workflow Plan** - Start here!

This is the primary documentation file that provides a complete overview of the workflow architecture and implementation plan. It includes:

- **Overview**: Introduction to the workflow and technologies used (n8n, LlamaIndex/LlamaParse)
- **Reference Workflow Templates**: Relevant n8n templates that inspired this workflow
- **Workflow Architecture**: Detailed breakdown of 5 phases:
  - Phase 1: PDF Input and Parsing
  - Phase 2: Text Processing and Structure Recognition
  - Phase 3: Relationship Mapping
  - Phase 4: JSON Generation
  - Phase 5: Validation and Error Handling
- **Detailed Workflow Steps**: Three workflow variations (Basic, AI-Enhanced, Multi-Page)
- **Required Nodes and Integrations**: List of n8n nodes and external services needed
- **Implementation Steps**: Step-by-step guide for setting up the workflow
- **JSON Output Structure**: Complete schema for the generated JSON files
- **Testing Strategy**: Test cases and validation approaches
- **Cost Considerations**: Pricing estimates for LlamaParse, OpenAI, and n8n
- **Security and Maintenance**: Best practices and ongoing maintenance tips

### 📱 [n8n_ui_instructions.html](n8n_ui_instructions.html)
**UI Instructions Guide**

Step-by-step instructions for using the n8n interface. This guide covers:

- **Getting Started**: How to access and navigate n8n
- **Creating Workflows**: How to create and name new workflows
- **Adding Nodes**: Two methods for adding nodes to your workflow
- **Configuring Nodes**: How to open and configure node settings
- **Connecting Nodes**: Manual connection and disconnection procedures
- **Testing Workflows**: How to execute workflows and test individual nodes
- **Saving and Activating**: How to save workflows and activate them for production
- **Viewing Executions**: How to review workflow execution history
- **Keyboard Shortcuts**: Essential keyboard shortcuts for efficiency
- **Tips and Tricks**: Helpful hints for working with n8n

### 🖼️ [n8n_visual_guides.html](n8n_visual_guides.html)
**Visual Guides and Screenshots**

Visual references and diagrams to help you understand the n8n interface and workflow structure. Includes:

- **Interface Overview**: Screenshot placeholders for main n8n interface
- **Workflow Canvas**: Visual guide to the workflow design area
- **Node Selection Panel**: How to find and add nodes
- **Complete Workflow Diagram**: Visual representation of the full workflow flow
- **Node Configuration Examples**: Screenshot placeholders for:
  - Webhook Node configuration
  - HTTP Request Node (LlamaParse)
  - OpenAI Node configuration
  - Code Node editor
- **Expression Editor**: Visual guide to using expressions
- **Execution View**: How to view workflow execution results
- **Error Handling Visual Guide**: How errors are displayed
- **Credentials Management**: Visual guide to setting up API credentials
- **Workflow Comparison**: Side-by-side comparison of basic vs AI-enhanced workflows

*Note: Screenshot placeholders are included. Replace them with actual screenshots of your n8n interface.*

### ⚙️ [n8n_node_configuration.html](n8n_node_configuration.html)
**Node Configuration Walkthrough**

Detailed, step-by-step configuration instructions for each node type used in the workflow. This comprehensive guide covers:

- **Webhook Node**: Configuration for receiving PDF files via HTTP POST
- **HTTP Request Node**: Setup for calling LlamaParse API
- **Wait Node**: Configuration for polling async operations
- **OpenAI Node**: Complete setup for AI-powered extraction including:
  - Credential configuration
  - Model selection
  - System and user prompts
  - Response format settings
- **Code Node (JavaScript)**: Detailed examples for:
  - Parsing OpenAI responses
  - Building relationship graphs
  - Generating final JSON structure
- **Write Binary File Node**: Configuration for saving JSON files
- **If Node**: Setting up conditional logic
- **Error Trigger Node**: Error handling configuration
- **Best Practices**: Tips for naming, testing, and securing your workflows

Each node section includes example configurations, code snippets, and troubleshooting tips.

### 🔧 [n8n_troubleshooting.html](n8n_troubleshooting.html)
**Troubleshooting Guide**

Comprehensive troubleshooting guide for common issues and errors. Covers:

- **Common Error Messages**: Solutions for:
  - Authentication failures
  - Undefined property errors
  - HTTP status code errors (400, 401, 403, 404, 500)
  - Timeout errors
  - File system errors
  - Webhook accessibility issues
- **Workflow-Specific Issues**: Solutions for:
  - LlamaParse API failures
  - OpenAI rate limits
  - Code node syntax errors
  - JSON structure validation issues
- **Debugging Tips**: Techniques for:
  - Using execution history
  - Testing individual nodes
  - Adding debug nodes
  - Using expression editor preview
- **Performance Issues**: Optimization strategies for:
  - Slow workflow execution
  - Large PDF file processing
- **Connection Issues**: Solutions for:
  - External API connectivity
  - Self-hosted n8n accessibility
- **Data Quality Issues**: Solutions for:
  - Incomplete data extraction
  - Incorrect relationship identification
- **Getting Help**: Resources and guidelines for reporting issues
- **Prevention Checklist**: Pre-flight checks before running workflows

## How to Use This Documentation

1. **Start with the Main Plan**: Read `n8n_org_chart_processing_plan.html` to understand the overall workflow architecture and requirements.

2. **Follow UI Instructions**: Use `n8n_ui_instructions.html` when you need to know how to perform specific actions in the n8n interface.

3. **Reference Visual Guides**: Check `n8n_visual_guides.html` for visual references and diagrams to help you understand the interface layout.

4. **Configure Nodes Step-by-Step**: Use `n8n_node_configuration.html` as you build your workflow, following the detailed configuration instructions for each node.

5. **Troubleshoot Issues**: Refer to `n8n_troubleshooting.html` when you encounter errors or unexpected behavior.

## Quick Links

- [n8n Platform](https://n8n.io/)
- [LlamaIndex/LlamaParse](https://www.llamaindex.ai/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community Forum](https://community.n8n.io/)

## Notes

- All HTML files are self-contained and can be opened directly in any web browser
- Navigation links between files use relative paths and will work when files are in the same directory
- Screenshot placeholders in the visual guides can be replaced with actual screenshots
- Code examples in the node configuration guide are ready to use but may need customization for your specific use case

---

*Last Updated: January 2025*
