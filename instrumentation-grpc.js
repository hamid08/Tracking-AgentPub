require('dotenv').config()
const { BasicTracerProvider, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } =  require('@opentelemetry/exporter-trace-otlp-grpc');

const collectorOptions = {
  // url is optional and can be omitted - default is http://localhost:4317
  // Unix domain sockets are also supported: 'unix:///path/to/socket.sock'
  url: `${process.env.OTLP_URL}`,
};

const provider = new BasicTracerProvider();
const exporter = new OTLPTraceExporter(collectorOptions);
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

provider.register();
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => provider.shutdown().catch(console.error));
});