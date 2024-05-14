const fs = require('fs');
const { print } = require('prisma-schema-dsl');

// Read the Prisma schema AST (abstract syntax tree) from your code or any source
const schemaAST = ... // Load or generate the AST

// Print the Prisma schema file from the AST
print(schemaAST)
  .then(prismaSchema => {
    // Now 'prismaSchema' contains the string representation of the Prisma schema
    // Write the schema to a file or pass it to your view template
    fs.writeFile('path/to/schema.prisma', prismaSchema, 'utf8', (err) => {
      if (err) {
        console.error('Error writing schema.prisma file:', err);
        return;
      }
      console.log('Prisma schema file saved successfully!');
    });
  })
  .catch(error => {
    console.error('Error printing Prisma schema:', error);
  });
