if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import Core from '../Core';
import { Loading, AddressModal, NoticeModal, validate, Message, Modal, htmlFactory, tools } from '@byhealth/walle';
import s from './game.scss';

const { dormancyFor } = tools;
const { createDom, inlineStyle } = htmlFactory;

import { renderGame } from './template';
import { handleGamePrizes } from './helper';

const stamp = (new Date()).getTime();

let gameTimer = null;

class Game {
	constructor(config) {
		const { style, prizes, targetId, parentId, emBase } = config;
		this.targetId = targetId || `game-target-${stamp}${window.Math.floor(window.Math.random() * 100)}`;
		this.emBase = emBase;
		this.prizes = prizes;
		this.GameTheme = style.GameTheme;
		this.parentId = parentId;
		this.core = new Core({
			...config,
			lottery: this.lottery,
			targetId: this.targetId
		});
		this.Loading = this.core.Loading;

		this.target = null;
		this.itemHeight = null;
		this.wrapHeight = null;
		this.prizesRepeats = 6; // 每组奖品重复的次数
		this.repeats = 1;
		this.gamePrizes = [];

		this.renderGame();
	}

	/**
	 *
	 * 初始化翻牌模板
	 * @memberof Game
	 */
	renderGame = () => {
		const { prizesResult, repeats} = handleGamePrizes(this.prizes, this.prizesRepeats);
		this.repeats = repeats;
		this.gamePrizes = prizesResult;

		return createDom(
			renderGame(
				this.GameTheme,
				this.gamePrizes,
				this.targetId
			),
			this.targetId,
			this.parentId,
			this.emBase
		)
			.then(() => {
				this.target = document.getElementById(this.targetId);
				this.slotwrap = this.target.querySelector(`.${s.slotwrap}`);
				this.target.classList.add(s.target);
				this.itemHeight = this.target.querySelector(`.${s.game}`).offsetHeight;
				this.wrapHeight = this.itemHeight * this.gamePrizes.length;
				this.slotwrap.style.height = `${this.wrapHeight}px`;
				
				return dormancyFor(50);
			})
			.then(() => {
				this.slotwrap.style.visibility = 'visible';
				const startbtn = this.target.querySelector(`.${s.startbtn}`);

				startbtn.onclick = e => {
					e.preventDefault();
					return this.core.lottery();
				};
			});
	}

	distory = () => {
		window.clearTimeout(gameTimer);
		this.core.distory();
	}

	/**
	 *
	 * 开始抽奖
	 * @param {Object} prize 所获奖品
	 * @param {Number} time 旋转时间默认5秒
	 * @param {Number} round 旋转圈数默认6圈
	 * @returns
	 * @memberof Game
	 */
	lottery = (prize) => new Promise((resolve) => {
		let prizeIndex = null;
		// 确认中奖位置
		for (let index = 0; index < this.prizes.length; index++) {
			const element = this.prizes[index];
			if (element.prizeId === prize.prizeId) {
				prizeIndex = index + 1;
				break;
			}
		}

		if (prize && !prizeIndex) {
			resolve(prize);
			console.log('所中奖品非展示奖池内奖品', prize);
			console.error('所中奖品非展示奖池内奖品');
			return;
		}

		if (prizeIndex !== null) {
			Promise.resolve()
				.then(() => {
					let beginningIndex = null;
					let endingIndex = null;
					for (let index = this.gamePrizes.length - 1; index > 0; index--) {
						const element = this.gamePrizes[index];
						console.log(element);
						if (element['prizeId'] === prize.prizeId) {
							endingIndex = index;
							break;
						}
					}

					for (let index = 0; index < this.gamePrizes.length; index++) {
						const element = this.gamePrizes[index];
						if (element['prizeId'] === prize.prizeId) {
							beginningIndex = index;
							break;
						}
					}

					const endingPositionY = endingIndex * this.itemHeight;
					const beginningPositionY = beginningIndex * this.itemHeight;

					this.slotwrap.style.top = `-${endingPositionY}px`;

					setTimeout(() => {
						this.slotwrap.style.top = `-${beginningPositionY}px`;
					}, 3000);
					// return this.start(prizeIndex);
				})
				.then(() =>dormancyFor(800))
				.then(() => resolve(prize));
		}
	});

}

module.exports = { Game, NoticeModal, Loading, validate, Message, Modal, AddressModal, inlineStyle };