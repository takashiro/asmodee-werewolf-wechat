import wx from '../wx';
import fetchSeatKey from '../../util/fetchSeatKey';

const {
	getStorage,
	setStorage,
} = wx;

afterEach(() => {
	setStorage.mockClear();
	getStorage.mockClear();
});

it('should generate a seat key', async () => {
	getStorage.mockImplementation((args: WechatMiniprogram.GetStorageOption) => {
		if (args.success) {
			args.success({
				data: '',
				errMsg: '',
			});
		}
	});

	setStorage.mockImplementation((args: WechatMiniprogram.SetStorageOption) => {
		if (args.success) {
			args.success({
				errMsg: '',
			});
		}
	});

	const seatKey = await fetchSeatKey();
	expect(seatKey).toHaveLength(16);
	expect(getStorage).toBeCalledWith(expect.objectContaining({ key: 'seatKey' }));
	expect(setStorage).toBeCalledWith(expect.objectContaining({ key: 'seatKey', data: seatKey }));
});

it('should generate the same seat key', async () => {
	const seatKey = 'fakeSeatKey';
	getStorage.mockImplementation((args: WechatMiniprogram.GetStorageOption) => {
		if (args.success) {
			args.success({
				data: seatKey,
				errMsg: '',
			});
		}
	});
	expect(await fetchSeatKey()).toBe(seatKey);
	expect(setStorage).not.toBeCalled();
});
