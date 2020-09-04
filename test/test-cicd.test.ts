import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as TestCicd from '../lib/test-cicd-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new TestCicd.TestCicdStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
