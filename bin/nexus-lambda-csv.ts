#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { NexusLambdaCsvStack } from "../lib/nexus-lambda-csv-stack";

const app = new cdk.App();
new NexusLambdaCsvStack(app, "NexusLambdaCsvStack", {});
