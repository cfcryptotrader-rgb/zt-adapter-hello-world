terraform {
  required_version = ">= 1.6.0"

  required_providers {
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.7"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = var.project
      Component = "authorization-gateway-example"
      ManagedBy = "terraform"
    }
  }
}

data "archive_file" "gateway" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/.terraform/zt-authorization-gateway.zip"
}

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "gateway" {
  name               = "${var.project}-authorization-gateway"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "basic_execution" {
  role       = aws_iam_role.gateway.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_cloudwatch_log_group" "gateway" {
  name              = "/aws/lambda/${var.project}-authorization-gateway"
  retention_in_days = var.log_retention_days
}

resource "aws_lambda_function" "gateway" {
  function_name    = "${var.project}-authorization-gateway"
  role             = aws_iam_role.gateway.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  filename         = data.archive_file.gateway.output_path
  source_code_hash = data.archive_file.gateway.output_base64sha256
  timeout          = 5
  memory_size      = 128

  environment {
    variables = {
      PROJECT = var.project
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.gateway,
    aws_iam_role_policy_attachment.basic_execution,
  ]
}

resource "aws_lambda_function_url" "gateway" {
  function_name      = aws_lambda_function.gateway.function_name
  authorization_type = "AWS_IAM"
}

