import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { Construct } from "constructs";
import { FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class NexusLambdaCsvStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const myFunction = new NodejsFunction(this, "my-function", {
      memorySize: 1024,
      timeout: Duration.seconds(60),
      runtime: lambda.Runtime.NODEJS_16_X,

      handler: "main",
      entry: path.join(__dirname, `/../src/lambda/index.ts`),
      environment: {
        URL: "https://api.dev.flur.ee/fdb/fluree/387028092977355",
      },
      //allowAllOutbound: true, needs VPC
      bundling: {
        minify: false, //change when I get working
        sourceMap: true,
      },
    });

    const fnUrl = myFunction.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, "TheUrl", {
      // The .url attributes will return the unique Function URL
      value: fnUrl.url,
    });
  }
}
