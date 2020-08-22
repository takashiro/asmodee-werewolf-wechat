import randstr from './randstr';

export default async function fetchSeatKey(): Promise<string> {
	const res = await wx.getStorage({ key: 'seatKey' });
	if (res.data && typeof res.data === 'string') {
		return res.data;
	}
	const seatKey = randstr(16);
	await wx.setStorage({
		key: 'seatKey',
		data: seatKey,
	});
	return seatKey;
}
