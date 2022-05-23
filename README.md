# Nexus Lambda Csv endpoint

- deploy using your aws credentials in a profile or default
- modify the environment variable in the [construct](https://github.com/fluree/nexus-lambda-csv/blob/c557a77517a161a00126526ef17132a543db54bc/lib/nexus-lambda-csv-stack.ts#L21) to point to the correct nexus dataset
- send the api-key as a query-param `?api-key=asfasdfasd`
- can modify the query in the lambda handler
- returns a csv file of results
