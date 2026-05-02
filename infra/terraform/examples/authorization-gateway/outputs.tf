output "authorization_gateway_function_name" {
  description = "Lambda function name for the example Authorization Gateway."
  value       = aws_lambda_function.gateway.function_name
}

output "authorization_gateway_url" {
  description = "IAM-authorized Lambda Function URL. Requires SigV4 signing."
  value       = aws_lambda_function_url.gateway.function_url
}

output "log_group_name" {
  description = "CloudWatch log group for gateway execution logs."
  value       = aws_cloudwatch_log_group.gateway.name
}

