export const mockFiles: Record<string, string> = {
  "/test/main.js": `
    import { helper } from './helper.js';
    const result = helper();
    const test = "Victor";
    console.log(result);
  `,
  "/test/helper.js": `
    export function helper() {
      return "Hello, World!";
    }
  `,
};