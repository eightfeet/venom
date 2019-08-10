if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import Core from '../Core';
import { Loading, AddressModal, NoticeModal, validate, Message, Modal, htmlFactory, tools } from '@byhealth/walle';
import s from './game.scss';

const { dormancyFor } = tools;
const { createDom, inlineStyle } = htmlFactory;

import { renderGame } from './template';

const stamp = (new Date()).getTime();

let timer = null;


//   .num-out-wrap-slot {
//     animation: slot-out 1.3s cubic-bezier(1, 0.06, 1, 0.44) 1;
//   }
  
//   .num-out-wrap-slot .num-wrap {
//     animation: slot 0.3s 1.3s linear infinite;
//   }

//   @keyframes slot-out {
//     0% {
//       transform: translate3d(0, -90%, 0);
//     }
//     100% {
//       transform: translate3d(0, 0%, 0);
//     }
//   }
//   @keyframes slot {
//     0% {
//       transform: translate3d(0, 100%, 0);
//     }
//     100% {
//       transform: translate3d(0, 0%, 0);
//     }
//   }

const runkeyfremas = function(y, id) {
	if (document.getElementById('slotrunninganimation')) {
		return;
	}

	let stylecontent =  `@keyframes slot-out${id} {
		0% {
			-webkit-transform: translate3d(0, ${y}px, 0);
			transform: translate3d(0, ${y}px, 0);
		}
		100% {
			-webkit-transform: translate3d(0, 0%, 0);
			transform: translate3d(0, 0%, 0);
		}
	}`;

	stylecontent += `@keyframes slot${id} {
		0% {
			-webkit-transform: translate3d(0, 100%, 0);
			transform: translate3d(0, 100%, 0);
		}
		100% {
			-webkit-transform: translate3d(0, 0%, 0);
			transform: translate3d(0, 0%, 0);
		}
	}`;

	stylecontent += `.${s.outslotwrap} {
		animation: slot-out${id} 1.3s cubic-bezier(1, 0.06, 1, 0.44) 1;
	}`;

	stylecontent += `.${s.outslotwrap} .${s.slotwrap} {
		animation: slot${id} 0.3s 1.3s linear infinite;
	}`;
	
	const style = document.createElement('style');
	style.id = 'slotrunninganimation';
	// 设置style属性
	style.type = 'text/css';

	style.innerHTML = stylecontent;

	document.getElementsByTagName('head')[0].appendChild(style);
};

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
		this.distory = this.core.distory;
		this.oldDge = 0;
		this.renderGame();
		this.activeElements = null;
	}

	/**
	 *
	 * 初始化翻牌模板
	 * @memberof Game
	 */
	renderGame = () => {
		return createDom(
			renderGame(
				this.GameTheme,
				this.prizes
			),
			this.targetId,
			this.parentId,
			this.emBase
		)
			.then(() => {
				const target = document.getElementById(this.targetId);
				target.classList.add(s.target);
				return dormancyFor(50);
			})
			.then(() => {
				const target = document.getElementById(this.targetId);
				const showprizebtn = target.querySelector(`.${s.toggleprize}`);
				const prizeswrap = target.querySelector(`.${s.prizeswrap}`);
				const startbtn = target.querySelector(`.${s.startbtn}`);
				const targetHeight = target.offsetHeight;

				runkeyfremas(-1 * targetHeight * (this.prizes.length - 1), this.targetId);

				// lotterybtn.onclick = (e) => {
				// 	e.preventDefault();
				// 	return this.core.lottery();
				// };
				let showPrize = false;
				const toggle = () => {
					if (showPrize) {
						prizeswrap.classList.remove(s.showprizes);
						showprizebtn.style.display = 'block';
						showPrize = false;
					} else {
						prizeswrap.classList.add(s.showprizes);
						showprizebtn.style.display = 'none';
						showPrize = true;
					}
				};
				showprizebtn.onclick = () => {
					toggle();
				};
				prizeswrap.onclick = () => {
					toggle();
				};
				startbtn.onclick = () => {
					this.start(3);
				};
			});
	}


	stopMachine = (score) => {
		const target = document.getElementById(this.targetId);
		const targetHeight = target.offsetHeight;

		const outwrap = target.querySelector(`.${s.outwrap}`);
		const slotwrap = target.querySelector(`.${s.slotwrap}`);



		setTimeout(() => {
			outwrap.classList.remove(s.outslotwrap);
			outwrap.style.animation = '';
			slotwrap.style.top = `${score * targetHeight}px`;
			slotwrap.classList.add(s.numwrapspin);
		}, 800);
	}

	startMachine = () => {
		const target = document.getElementById(this.targetId);
		const outwrap = target.querySelector(`.${s.outwrap}`);
		const slotwrap = target.querySelector(`.${s.slotwrap}`);

		slotwrap.className = s.slotwrap;
		slotwrap.style.top = 0;

		setTimeout(() => {
			outwrap.classList.add(s.outslotwrap);
		}, 800);
	}


	start = (prize) => {
		this.startMachine();
		setTimeout(() => {
			this.stopMachine(prize);
		}, 5000);
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
			}
		}

		if (prize && !prizeIndex) {
			resolve(prize);
			console.error('所中奖品非展示奖池内奖品');
		}

		window.clearTimeout(timer);
		resolve(prize);
	});

}

module.exports = { Game, NoticeModal, Loading, validate, Message, Modal, AddressModal, inlineStyle };