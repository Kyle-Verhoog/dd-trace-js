'use strict'

const id = require('../../src/id')

describe('SpanContext', () => {
  let SpanContext

  beforeEach(() => {
    SpanContext = require('../../src/opentracing/span_context')
  })

  it('should instantiate with the given properties', () => {
    const noop = {}
    const props = {
      traceId: '123',
      spanId: '456',
      parentId: '789',
      name: 'test',
      isFinished: true,
      tags: {},
      metrics: {},
      sampling: { priority: 2 },
      baggageItems: { foo: 'bar' },
      traceFlags: {
        sampled: false,
        debug: true
      },
      noop,
      trace: {
        started: ['span1', 'span2'],
        finished: ['span1']
      }
    }
    const spanContext = new SpanContext(props)

    expect(spanContext).to.deep.equal({
      __proto__: SpanContext.prototype,
      _isFinished: true,
      _tags: {},
      _spanData: {
        error: 0,
        meta: {},
        metrics: {},
        name: 'test',
        parent_id: '789',
        span_id: '456',
        trace_id: '123'
      },
      _sampling: { priority: 2 },
      _baggageItems: { foo: 'bar' },
      _traceFlags: {
        sampled: false,
        debug: true
      },
      _noop: noop,
      _trace: {
        started: ['span1', 'span2'],
        finished: ['span1']
      }
    })
  })

  it('should have the correct default values', () => {
    const spanContext = new SpanContext({
      traceId: '123',
      spanId: '456'
    })

    expect(spanContext).to.deep.equal({
      __proto__: SpanContext.prototype,
      _isFinished: false,
      _tags: {},
      _spanData: {
        error: 0,
        meta: {},
        metrics: {},
        name: undefined,
        parent_id: {
          _buffer: spanContext._spanData.parent_id._buffer
        },
        span_id: '456',
        trace_id: '123'
      },
      _sampling: {},
      _baggageItems: {},
      _traceFlags: {
        sampled: true,
        debug: false
      },
      _noop: null,
      _trace: {
        started: [],
        finished: []
      }
    })
  })

  describe('toTraceId()', () => {
    it('should return the trace ID as string', () => {
      const spanContext = new SpanContext({
        traceId: id('123', 10),
        spanId: id('456', 10)
      })

      expect(spanContext.toTraceId()).to.equal('123')
    })
  })

  describe('toSpanId()', () => {
    it('should return the span ID as string', () => {
      const spanContext = new SpanContext({
        traceId: id('123', 10),
        spanId: id('456', 10)
      })

      expect(spanContext.toSpanId()).to.equal('456')
    })
  })
})
