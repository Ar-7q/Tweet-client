
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:7000/graphql",
  documents: ["graphql/**/*.{ts,tsx}"],
  generates: {
    "gql/": {
      preset: "client",
      plugins: []
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
