import { ResultModal, AddressModal, Loading, tools, htmlFactory } from '@byhealth/walle';
// import s from './template/game.scss';
import { fixIosScroll } from './helper';

const { dormancyFor, isObject } = tools;
const { removeDom } = htmlFactory;

const stamp = (new Date()).getTime();

fixIosScroll();
/**
 * 游戏核心流程
 * @class Core
 */
class Core {
	constructor(config) {
		const {
			targetId, parentId, style,
			outerFrameId,
			start,
			saveAddress,
			prizes,
			playerPhone,
			receiverInfo,
			cardIdRequest,
			checkVerificationCode,
			failedModalTitle,
			successModalTitle,
			submitSuccessText,
			submitAddressText,
			submitFailedText,
			emBase,
			loading,
			lottery
		} = config;

		const {
			SuccessModalTheme,
			FailedModalTheme,
			AddressModalTheme,
			MessageTheme,
			LoadingTheme
		} = style || {};

		this.targetId = targetId || `game-target-${stamp}${window.Math.floor(window.Math.random() * 100)}`;
		this.parentId = parentId;
		this.prizes = prizes;
		this.lotteryDrawing = false;
		this.emBase = emBase || null;
		this.loadingSet = isObject(loading) ? loading : {};

		const onConfirm = typeof config.onConfirm === 'function' ? config.onConfirm : () => { };
		const onCancel = typeof config.onCancel === 'function' ? config.onCancel : () => { };

		// 重制游戏时this.onCancel嫁接onCancel方法
		this.SuccessModal = new ResultModal({
			outerFrameId,
			style: SuccessModalTheme,
			modalTitle: successModalTitle,
			onCancel: this.onCancel(onCancel),
			submitText: submitSuccessText,
			onEnsure: this.onEnsure(onConfirm),
			submitAddressText
		});

		this.FailedModal = new ResultModal({
			outerFrameId,
			style: FailedModalTheme,
			onEnsure: this.onEnsure(onConfirm),
			submitText: submitFailedText,
			modalTitle: failedModalTitle,
			onCancel: this.onCancel(onCancel)
		});

		this.AddressModal = new AddressModal({
			AddressModalTheme,
			outerFrameId,
			MessageTheme,
			playerPhone,
			receiverInfo,
			cardIdRequest,
			checkVerificationCode
		});

		const data = { style: LoadingTheme, parentId: outerFrameId, ...this.loadingSet };
		this.Loading = new Loading(data);
		this.start = start || function () { throw '无抽奖方法'; };
		this.start = start || (() => new Promise((resolve, reject) => {
			reject('start方法必须返回一个Promise对象');
		}));

		// 重制游戏时this.onSaveAddress嫁接saveAddress方法
		this.saveAddress = saveAddress || (() => new Promise((resolve, reject) => {
			reject('需要saveAddress方法用来保存你的地址');
		}));

		this.lotteryAction = lottery || (() => new Promise((resolve, reject) => {
			reject('lottery方法必须返回一个Promise对象');
		}));
	}

	/**
	 * 放弃中奖结果时重置游戏
	 * @param { Function } cancel 承接放弃中奖结果方法
	 * @memberof Core
	 */
	onCancel = (cancel) => () => {
		cancel();
	}

	onEnsure = (ensure) => (prize) => {
		ensure(prize);
	}

	/**
	 * 修改和保存地址
	 * @param {Function} callback 保存地址回调
	 * @param {Function} didSaveCallback 完成保存地址后的回调
	 * @memberof Core
	 */
	handleSaveAddress = (onEnsure, onCancel) => {
		this.AddressModal.showModal(this.saveAddress, onCancel, onEnsure);
	}

	/**
	 *
	 * 销毁Game
	 * @memberof Core
	 */
	distory = () => {
		this.Loading.reset();
		const mobileSelect = document.querySelector('.mobileSelect');
		mobileSelect && mobileSelect.parentNode.removeChild(mobileSelect);
		Promise.all([
			removeDom(this.targetId),
			removeDom(this.Loading.id),
			removeDom(this.SuccessModal.state.id),
			removeDom(this.FailedModal.state.id),
			removeDom(this.AddressModal.state.id),
			removeDom(this.AddressModal.state.id)
		])
			.then()
			.catch(err => console.log(err));
	}

	/**
	 *
	 * 抽奖
	 * @returns
	 * @memberof Core
	 */
	lottery = () => {
		if (this.lotteryDrawing) {
			return Promise.reject('The lottery is currently drawing. Just a moment');
		}
		this.lotteryDrawing = true;
		Promise.resolve()
			.then(() => this.start())
			.then(res => {
				return Promise.resolve()
					// 处理抽奖过程
					.then(() => this.startLottery(res))
					// 处理抽奖过程结束
					.then(() => dormancyFor(600).then(() => res));
			})
			.then(res => {
				this.lotteryDrawing = false;
				if (res.prizeType === 0) {
					return this.showFailedModal(res);
				}
				return this.showSuccessModal(res);
			})
			.catch(err => {
				this.lotteryDrawing = false;
				console.error(err);
			});
	}

	/**
	 *
	 * 开始抽奖
	 * @param {Object} prize 所获奖品
	 * @returns
	 * @memberof Core
	 */
	startLottery = (prize) => {
		const { prizeId } = prize || {};

		if (!prizeId) {
			this.lotteryDrawing = false;
			throw (`抽奖失败,没有中奖ID（prizeId）\n 异常中奖信息：${JSON.stringify(prize, null, 2)}`);
		}

		const data = this.prizes.filter(item => item.prizeId === prizeId);
		// 可能存在多个同ID奖品
		if (data && data.length >= 1) {
			return this.lotteryAction(prize).then(() => prize);
		}

		throw (`抽奖异常 \n 异常中奖信息：${JSON.stringify(prize, null, 2)}`);
	}

	/**
	 *
	 * 显示中奖信息
	 * 实物奖品时填写收货地址
	 * @param {Object} prize
	 * @returns
	 * @memberof Core
	 */
	showSuccessModal = (prize) => {
		return this.SuccessModal.showModal(prize)
			.then(prize => {
				// 1：默认；2：填写地址；3：链接类；4：虚拟卡
				if (prize.receiveType === 2) {
					this.AddressModal.showModal(this.saveAddress, () => {
						this.showSuccessModal(prize);
					});
				} else {
					Promise.resolve()
						.then(() => dormancyFor(800));
				}
			});
	}

	/**
	 *
	 * 显示失败提示
	 * @param {Object} prize
	 * @returns
	 * @memberof Core
	 */
	showFailedModal(prize) {
		return this.FailedModal.showModal(prize);
	}

}


export default Core;