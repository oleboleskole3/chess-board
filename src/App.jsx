import React, { useState, useEffect } from "react"
import './App.css';
import Grid from './Grid/Grid'
import rockImg from './imgs/rock.png'
import paperImg from './imgs/paper.png'
import scissorsImg from './imgs/scissors.png'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { DndProvider } from 'react-dnd'
import isValidMove from "./isValidMove";

const game = generateGameObject(7, 7)

window.game = game


//#region  https://stackoverflow.com/a/3540295
var isMobile = !('draggable' in document.createElement('span'));
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}
window.isMobile = isMobile
//#endregion

function App() {
	const [board, setBoard] = useState(game.board)
	game.update = setBoard

	useEffect(_ => {
		setBoard(game.board)
	}, [])

	return (
		<div className="App">
			<DndProvider backend={(isMobile) ? TouchBackend : HTML5Backend} options={{enableMouseEvents: true}}>
					<Grid grid={board} width={game.width} height={game.height} checkered={true} />
			</DndProvider>
		</div>
	);
}

/**
 * 
 * @param {number} width 
 * @param {number} height 
 * @returns {{
 *  width: number,
 *  height: number,
 *  update: Function,
 *  board: {
 *    img?: string,
 *    events: React.HTMLAttributes<HTMLDivElement>
 *  }[],
 * 	movePiece: Function
 * }}
 */

function generateGameObject(width, height) {
	let board = Array(width * height).fill(null).map((_, i) => ({
		img: [
			rockImg,
			paperImg,
			scissorsImg,
			null
		][Math.floor(Math.random() * 4)], events: {}
	}))

	return {
		width,
		height,
		update: _ => undefined,
		set board(value) {
			console.log('set', value)
			board = value
			this.update(value)
		},
		get board() {
			return new Proxy(board, {
				set: (target, name, value) => {
					console.log('set', name, value)
					target[name] = value
					this.update(board)
					return true
				}
			});
		},
		/**
		 * @description Moves a piece
		 * @param {number} from The index of the piece to move
		 * @param {number} to The index to move the piece to
		 */
		movePiece(from, to) {
			const newBoard = [...this.board]
			// console.log('move', from, to, newBoard[to].img, newBoard[from].img)
			// if (newBoard[to].img) return
			// if (!newBoard[from].img) return
			if (!isValidMove({
				pos: {
					x: from % this.width,
					y: Math.floor(from / this.width)
				},
				type: ['rock', 'paper', 'scissors'][[rockImg, paperImg, scissorsImg].indexOf(newBoard[from].img)]
			}, {
				pos: {
					x: to % this.width,
					y: Math.floor(to / this.width)
				},
				type: [null, 'rock', 'paper', 'scissors'][[rockImg, paperImg, scissorsImg].indexOf(newBoard[to].img)+1]
			})) return
			
			newBoard[to] = Object.assign({}, newBoard[from])
			newBoard[from] = Object.assign({}, newBoard[from], {img: null})
			this.board = newBoard
			// console.log('moved')
		}
	}
}

export default App;
