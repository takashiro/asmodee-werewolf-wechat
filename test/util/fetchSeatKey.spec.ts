import fetchSeatKey from '../../src/util/fetchSeatKey';

const getStorage = jest.fn();
const setStorage = jest.fn();

beforeAll(() => {
	Reflect.set(global, 'wx', {
		getStorage,
		setStorage,
	});
});

afterEach(() => {
	setStorage.mockClear();
	getStorage.mockClear();
});

it('should generate a seat key', async () => {
	getStorage.mockResolvedValue({});
	const seatKey = await fetchSeatKey();
	expect(seatKey).toHaveLength(16);
	expect(getStorage).toBeCalledWith({ key: 'seatKey' });
	expect(setStorage).toBeCalledWith({ key: 'seatKey', data: seatKey });
});

it('should generate the same seat key', async () => {
	const seatKey = 'fakeSeatKey';
	getStorage.mockResolvedValue({ data: seatKey });
	expect(await fetchSeatKey()).toBe(seatKey);
	expect(setStorage).not.toBeCalled();
});
