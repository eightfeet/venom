export default function createCss(height, prizes, id) {
	if (document.getElementById('slotrunninganimation')) {
		return;
	}

	const prizesLength = prizes.length;

	const posSlotOut = -1 * height * (prizesLength - 1);
	const totalTimes = prizesLength * 215;

	let stylecontent = `@keyframes slot-out${id} {
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

	stylecontent += `.outslotwrap-${id} {
		animation: slot-out${id} ${totalTimes}ms cubic-bezier(1, 0.06, 1, 0.44) 1;
	}`;

	stylecontent += `.outslotwrap-${id} .slotwrap-${id} {
		animation: slot${id} 0.3s ${totalTimes}ms linear infinite;
	}`;

	for (let index = 0; index < prizes.length; index++) {
		stylecontent += `.wrapspin-${id}-${prizes.length - index} {
			position: relative;
			top: ${index * height}px;
			animation: shake${id} ease-out 1s 1;
		}`;
	}
	stylecontent += `.outwrap-${id} {
		height: ${prizes.length * height}px; /* no */
		position: relative;
		transform: translate3d(0, ${posSlotOut}px, 0);
	  }`;

	stylecontent += `.item-${id} {
		width: 100%;
		text-align: center;
		overflow: hidden;
		position: relative;
	  }`;

	stylecontent += `.item-prize-${id} {
		position: relative;
	  }`;

	stylecontent += `.item-${id} img {
		width: 100%;
		height: 100%;
	}`;

	stylecontent += `.item-${id} p {
		padding: 0;
		margin: 0;
		text-align: center;
		position: absolute;
	}`;

	stylecontent += `.slotboard-${id} {
		width: 100%; /* no */
		height: 100%; /* no */
		position: relative;
		overflow: hidden;
	}`;

	stylecontent += `.comeback-${id} {
		top: 0;
		-webkit-transition: top 0.2s;
		transition: top 0.5s;
	}`;

	stylecontent += `.slotwrap-${id} {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 100%;
		width: 100%;
	}`;

	const style = document.createElement('style');
	style.id = `slotmachine${id}`;
	style.setAttribute('class', 'slotmachinetags');
	// 设置style属性
	style.type = 'text/css';

	style.innerHTML = stylecontent;

	document.getElementsByTagName('head')[0].appendChild(style);
}