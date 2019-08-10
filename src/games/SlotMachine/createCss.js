import s from './game.scss';

export default function createCss(height, prizes, id) {
	if (document.getElementById('slotrunninganimation')) {
		return;
	}

	const posSlotOut = -1 * height * (prizes.length - 1);

	let stylecontent =  `@keyframes slot-out${id} {
		0% {
			-webkit-transform: translate3d(0, ${posSlotOut}px, 0);
			transform: translate3d(0, ${posSlotOut}px, 0);
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

	stylecontent += `@keyframes shake${id} {
		0% {
			-webkit-transform: translate3d(0, -5%, 0);
			transform: translate3d(0, -5%, 0);
		  }
		  80% {
			-webkit-transform: translate3d(0, 1%, 0);
			transform: translate3d(0, 1%, 0);
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

	for (let index = 0; index < prizes.length; index++) {
		const element = prizes[index];
		stylecontent += `.${s.wrapspin}${index} {
			position: relative;
			top: ${index * height}px;
			animation: shake${id} ease-out 1s 1;
		}`
	}
	
	const style = document.createElement('style');
	style.id = 'slotrunninganimation';
	// 设置style属性
	style.type = 'text/css';

	style.innerHTML = stylecontent;

	document.getElementsByTagName('head')[0].appendChild(style);
};