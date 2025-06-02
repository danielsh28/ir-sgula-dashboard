/**
 * Converts an AsyncIterable to a ReadableStream, handling different response formats
 * from LangChain and other LLM frameworks
 */
export function asyncIterableToReadableStream<T>(
  iterable: AsyncIterable<T>
): ReadableStream<string> {
  const iterator = iterable[Symbol.asyncIterator]();

  return new ReadableStream<string>({
    async pull(controller) {
      try {
        while (true) {
          const { value, done } = await iterator.next();
          if (done) {
            controller.close();
            break;
          }

          const jsonString =
            typeof value === 'string' ? value : JSON.stringify(value);
          let parsed;
          try {
            parsed = JSON.parse(jsonString);
            //console.log('Parsed stream chunk:', parsed);
          } catch (parseErr) {
            console.warn('Failed to parse JSON:', jsonString, parseErr);
            continue;
          }

          // Handle different response formats that might come from the LLM
          console.log('Parsed stream chunk:', parsed);
          if (parsed.answer) {
            controller.enqueue(parsed.answer);
          } else if (parsed.output) {
            controller.enqueue(parsed.output);
          } else if (parsed.response) {
            controller.enqueue(parsed.response);
          } else if (parsed.content) {
            controller.enqueue(parsed.content);
          } else if (typeof parsed === 'string') {
            controller.enqueue(parsed);
          } else if (typeof value === 'string') {
            controller.enqueue(value);
          }
        }
      } catch (err) {
        console.error('Stream processing error:', err);
        controller.error(err);
      }
    },
  });
}
