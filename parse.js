const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

// Function to parse Prisma schema
function parsePrismaSchema() {
    const prismaSchemaPath = path.join(process.cwd(), "prisma/schema.prisma");

    // Check if Prisma schema file exists
    if (!fs.existsSync(prismaSchemaPath)) {
        throw new Error("Prisma schema file not found");
    }

    // Read Prisma schema file
    const prismaSchema = fs.readFileSync(prismaSchemaPath, "utf-8");

    // Parse Prisma schema
    const tables = {};
    let currentTable = null;

    // Splitting the schema file by lines
    const lines = prismaSchema.split("\n");

    lines.forEach(line => {
        // Assuming models start with "model" keyword
        if (line.trim().startsWith("model")) {
            const modelName = line.trim().split(" ")[1]; // Extracting model name
            tables[modelName] = {};
            currentTable = modelName;
        } else if (currentTable && line.trim().startsWith("}")) {
            // End of model definition
            currentTable = null;
        } else if (currentTable && !line.trim().startsWith("model") && !line.trim().startsWith("}")) {
            // Field definition inside a model
            const parts = line.trim().split(/\s+/); // Splitting by whitespace
            const fieldName = parts[0]; // Extracting field name
            tables[currentTable][fieldName] = parts.slice(1); // Storing field attributes
        }
    });

    return tables;
}

// Serve parsed Prisma schema data
app.get("/prisma-schema", (req, res) => {
    try {
        const schemaData = parsePrismaSchema();
        res.json(schemaData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});