import { client } from '../../base/Client';

const rootUrl = 'https://werewolf.takashiro.cn/api';
const request = jest.fn();

beforeAll(() => {
	Reflect.set(global, 'wx', {
		request,
	});
});

afterEach(() => {
	request.mockClear();
});

it('sends a GET request', () => {
	client.get({
		url: 'room',
		data: {
			id: 1,
		},
	});
	expect(request).toBeCalledWith({
		method: 'GET',
		url: `${rootUrl}/room`,
		data: {
			id: 1,
		},
	});
});

it('sends a POST request', () => {
	client.post({
		url: 'room',
		data: {
			id: 1,
		},
	});
	expect(request).toBeCalledWith({
		method: 'POST',
		url: `${rootUrl}/room`,
		data: {
			id: 1,
		},
	});
});
