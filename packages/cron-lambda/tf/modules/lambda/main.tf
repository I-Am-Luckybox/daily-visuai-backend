data "archive_file" "lambda_binary" {
  type = "zip"
  source_file = "${path.module}/../../../bundle/index.js"
  output_path = "${path.module}/../../../bundle/bundle.zip"
}

resource "aws_lambda_function" "this" {
  filename = data.archive_file.lambda_binary.output_path
  handler = "index.handler"
  function_name = "image-cron-worker"
  role = var.iam_role_arn
  timeout = 1
  memory_size = 512
  runtime = "nodejs22.x"
}