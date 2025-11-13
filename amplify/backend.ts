import { RemovalPolicy, Tags } from "aws-cdk-lib";
import { auth } from "./auth/resource";
import { defineBackend } from "@aws-amplify/backend";
import ci from "ci-info";
import { Duration } from "aws-cdk-lib";

let AMPLIFY_GEN_1_ENV_NAME = process.env.AMPLIFY_GEN_1_ENV_NAME;
if (ci.isCI && !AMPLIFY_GEN_1_ENV_NAME) {
    throw new Error("AMPLIFY_GEN_1_ENV_NAME is required in CI environment");
}
else if (!ci.isCI && !AMPLIFY_GEN_1_ENV_NAME) {
    AMPLIFY_GEN_1_ENV_NAME = "sandbox";
}

const backend = defineBackend({
    auth
});
const cfnUserPool = backend.auth.resources.cfnResources.cfnUserPool;
cfnUserPool.userPoolName = `testdecomf4b5f732_userpool_f4b5f732-${AMPLIFY_GEN_1_ENV_NAME}`;
cfnUserPool.usernameAttributes = undefined;
cfnUserPool.policies = {
    passwordPolicy: {
        minimumLength: 8,
        requireUppercase: false,
        requireLowercase: false,
        requireNumbers: false,
        requireSymbols: false,
        temporaryPasswordValidityDays: 7
    }
};
const cfnIdentityPool = backend.auth.resources.cfnResources.cfnIdentityPool;
cfnIdentityPool.identityPoolName = `testdecomf4b5f732_identitypool_f4b5f732__${AMPLIFY_GEN_1_ENV_NAME}`;
cfnIdentityPool.allowUnauthenticatedIdentities = false;
const userPool = backend.auth.resources.userPool;
const userPoolClient = userPool.addClient("NativeAppClient", {
    userPoolClientName: "testdef4b5f732_app_client",
    refreshTokenValidity: Duration.days(30),
    disableOAuth: true,
    enableTokenRevocation: true,
    enablePropagateAdditionalUserContextData: false,
    authSessionValidity: Duration.minutes(3),
    generateSecret: false
});
// Tags.of(backend.stack).add("gen1-migrated-app", "true");
