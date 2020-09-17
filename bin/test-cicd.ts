#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TestPipelineStack } from '../lib/test-pipeline-stack';

const app = new cdk.App();
new TestPipelineStack(app, 'TestXPipelineStack', {
  env: {
    region: 'eu-west-1',
    account: '355421412380',
  }
});
