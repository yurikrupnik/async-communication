import {
  For,
  createSignal,
  Component,
  createEffect,
  createMemo,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import {
  Prediction as PredictionType,
  CreatePredictDto,
} from '@async-communication/predictions';
import axios from 'axios';

const getPredictions = () => {
  return axios.get('http://localhost:3333/api/predictions').then((r) => r.data);
};

const createPredictions = (body: any) => {
  return axios
    .post('http://localhost:3333/api/predictions', body)
    .then((r) => r.data);
};

const Prediction: Component = () => {
  const [data, setData] = createSignal<PredictionType[]>([]);
  const [fields, setFields] = createStore<CreatePredictDto>({
    customerId: '',
    predictions: [],
    modelId: '',
    requestId: '',
  });

  createEffect(() => {
    getPredictions().then(setData);
  });

  const isValid = createMemo(() => {
    return Object.values(fields).every((v) => v.length);
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    createPredictions({
      ...fields,
      // eslint-disable-next-line
      // @ts-ignore for form it is string value
      predictions: fields.predictions.split(','),
    }).then(() => {
      console.log('setting empty form fields fails');
      setFields(() => ({}));
    });
  };

  const handleInput = (e: any) => {
    setFields({ [e.currentTarget.name]: e.currentTarget.value });
  };

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ display: 'flex' }}>
        <form style={{ 'flex-grow': 1, padding: '10px' }}>
          <div
            style={{
              padding: '10px',
              'font-weight': 'bold',
              'text-decoration': 'underline',
            }}
          >
            Prediction form
          </div>
          <div>
            <div style={{ 'margin-bottom': '15px' }}>
              <label>Model Id:</label>
              <input
                style={{ width: '100%' }}
                type="text"
                placeholder="Model Id"
                name="modelId"
                // value={fields.modelId}
                onInput={handleInput}
              />
            </div>

            <div style={{ 'margin-bottom': '15px' }}>
              <label>Request Id:</label>
              <input
                style={{ width: '100%' }}
                type="text"
                placeholder="RequestId id"
                name="requestId"
                // value={fields.requestId}
                onInput={handleInput}
              />
            </div>
            <div style={{ 'margin-bottom': '15px' }}>
              <label>Customer Id:</label>
              <input
                style={{ width: '100%' }}
                type="text"
                placeholder="CustomerId id"
                name="customerId"
                // value={fields.customerId}
                onInput={handleInput}
              />
            </div>
            <div style={{ 'margin-bottom': '15px' }}>
              <label>Predictions List:</label>
              <input
                style={{ width: '100%' }}
                type="text"
                placeholder="Predictions Array"
                name="predictions"
                // value={fields.predictions}
                onInput={handleInput}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              onClick={handleSubmit}
              style={{
                'font-weight': 'bold',
                padding: '10px',
                background: isValid() ? 'lightblue' : '',
              }}
              disabled={!isValid()}
            >
              submit
            </button>
          </div>
        </form>

        <div style={{ 'flex-grow': 4, padding: '10px' }}>
          <div
            style={{
              padding: '10px',
              'font-weight': 'bold',
              'text-decoration': 'underline',
            }}
          >
            Prediction List
          </div>
          <div
            style={{
              display: 'flex',
              padding: '10px',
              'justify-content': 'space-around',
            }}
          >
            <div>Request Id</div>
            <div>Customer Id</div>
            <div>Model Id</div>
            <div>Predictions</div>
            <div>Prediction Result</div>
          </div>
          <For each={data()}>
            {(prediction) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    padding: '10px',
                    'justify-content': 'space-around',
                  }}
                >
                  <div>
                    <span>{prediction.requestId}</span>
                  </div>
                  <div>
                    <span>{prediction.customerId}</span>
                  </div>
                  <div>
                    <span>{prediction.modelId}</span>
                  </div>
                  <div>
                    <span>{prediction.predictions.join()}</span>
                  </div>
                  <div>
                    <span>{prediction.predictionResult}</span>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
