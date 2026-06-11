import * as cdk from 'aws-cdk-lib';
import * as cbuild from 'aws-cdk-lib/aws-codebuild';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { ScenarioStage } from './scenario';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'TestingPipeline',

      crossAccountKeys: true,

      codeBuildDefaults: {
        buildEnvironment: {
          buildImage: cbuild.LinuxBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-x86_64-standard:6.0'),
        }
      },

      // Where the source can be found
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('rix0rrr/test-cicd', 'master'),
        commands: [
          'yarn install --frozen-lockfile',
          'yarn build',
          'npx cdk synth',
        ]
      }),
    });

    pipeline.pipeline.addToRolePolicy(new PolicyStatement({
      sid: "CloudWatchWriteAccess",
      actions: [
        "logs:CreateLogGroup",
        "logs:PutRetentionPolicy"
      ],
      resources: ["arn:aws:logs:*:*:log-group:/aws/codepipeline/*"],
    }));

    pipeline.pipeline.addToRolePolicy(new PolicyStatement({
      "sid": "CloudWatchReadOnlyAccess",
      actions: [
        "logs:DescribeLogStreams",
        "logs:DescribeLogGroups",
        "logs:GetLogEvents",
        "logs:FilterLogEvents"
      ],
      "resources": ["*"],
    }));

    pipeline.pipeline.addToRolePolicy(new PolicyStatement({
      "sid": "CloudFormationReadOnlyAccess",
      "actions": [
        "cloudformation:DescribeStacks",
        "cloudformation:DescribeStackEvents",
        "cloudformation:DescribeStackResources",
        "cloudformation:DescribeChangeSet",
        "cloudformation:GetTemplate",
        "cloudformation:ValidateTemplate"
      ],
      "resources": ["*"],
    }));

    pipeline.pipeline.addToRolePolicy(new PolicyStatement({
      "sid": "QDiagnoseConsoleErrorsAccess",
      "actions": [
        "q:GetTroubleshootingResults",
        "q:StartTroubleshootingAnalysis",
        "q:StartTroubleshootingResolutionExplanation"
      ],
      "resources": ["*"],
    }));

    pipeline.pipeline.addToRolePolicy(new PolicyStatement({
      "sid": "CodeBuildReadOnlyAccess",
      "actions": [
        "codebuild:BatchGetBuilds"
      ],
      "resources": ["*"],
    }));

    pipeline.pipeline.addToRolePolicy(new PolicyStatement({
      "sid": "CodePipelineReadOnlyAccess",
      "actions": [
        "codepipeline:GetPipeline",
        "codepipeline:GetPipelineExecution",
        "codepipeline:GetPipelineState",
        "codepipeline:ListActionExecutions"
      ],
      "resources": ["*"],
    }));

    pipeline.addStage(new ScenarioStage(this, 'TheStage'));
  }
}

