// pages/room-creator/numberinput.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		role: {
			type: Number,
			value: 0,
		},
		value: {
			type: Number,
			value: 0,
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		setValue(newVal) {
			this.setData({ value: newVal });
			this.triggerEvent('numberchange', {
				role: this.data.role,
				value: newVal
			});
		},

		handleInput(e) {
			let num = parseInt(e.detail.value, 10);
			if (isNaN(num)) {
				return;
			}

			if (num <= 0) {
				num = 0;
			}

			this.setValue(num);
		},

		handleDecrease() {
			let newVal = this.data.value - 1;
			if (newVal >= 0) {
				this.setValue(newVal);
			}
		},

		handleIncrease() {
			let newVal = this.data.value + 1;
			this.setValue(newVal);
		},
	}
})
