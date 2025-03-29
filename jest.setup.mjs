// This ensures that Jest can run ESM tests without issues.
import { jest } from "@jest/globals";
global.jest = jest;
