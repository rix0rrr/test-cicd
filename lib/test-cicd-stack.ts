import * as cdk from '@aws-cdk/core';
import * as cdkp from '@aws-cdk/pipelines';
import * as cb from '@aws-cdk/aws-codebuild';
import * as cp from '@aws-cdk/aws-codepipeline';
import * as cpa from '@aws-cdk/aws-codepipeline-actions';

export class TestCicdStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sourceArtifact = new cp.Artifact();
    const cloudAssemblyArtifact = new cp.Artifact();

    const pipeline = new cdkp.CdkPipeline(this, 'Pipeline', {
      cloudAssemblyArtifact,
      sourceAction: new cpa.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: cdk.SecretValue.secretsManager('github-token'),
        // Replace these with your actual GitHub project name
        owner: 'rix0rrr',
        repo: 'test-cicd',
      }),

      synthAction: cdkp.SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
      }),
    });

    const codePipeline = pipeline.node.findChild('Pipeline') as cp.Pipeline;

    const project = new cb.Project(this, 'Bla', {
      buildSpec: cb.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: ['echo "Vroom vroom"'],
          },
        },
      }),
    });

    codePipeline.stages[1].addAction(new cpa.CodeBuildAction({
      actionName: 'DoBla',
      input: sourceArtifact,
      project,
      environmentVariables: {
        SOME_VARIABLE_VARIABLE: { value: new Date().toString() },
      },
    }));
  }
}
