export const mockFiles: Record<string, string> = {
  "/test/main.js": `
    import { helper } from './helper.js';
    import { resultObj } from './helper.js';
    const result = helper();
    const { res } = resultObj;
    export const test = "Victor";
    console.log(result);
    const username = res.username;
    const fullname = res.fullname;
    console.log("username", username);
    console.log("fullname", fullname);
  `,
  "/test/helper.js": `
    import {getProfile} from './profile.js';
    export function helper() {
      return "Hello, World!";
    }
    
    export const resultObj = getProfile();
    const { res } = resultObj;
    export const test = "Victor";
    console.log(result);
    const username = res.username;
    const fullname = res.fullname;
    console.log("username", username);
    console.log("fullname", fullname);
  `,
  "/test/profile.js": `
    import {getProfile} from 'profile-lib';

    export {getProfile};
  `,
};