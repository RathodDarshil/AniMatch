import '../styles/SwipingArea.scss';
import TinderCard from 'react-tinder-card';
import Axios from 'axios';
import { useQuery } from 'react-query';

const uninterceptedAxios = Axios.create();

const SwipingArea = () => {
	let { data: animes } = useQuery('animeData', async function getData() {
		const payload = {
			params: {
				q: 'deathnote',
			},
		};

		const reqData = await uninterceptedAxios
			.get('https://api.jikan.moe/v3/search/anime', payload)
			.then((res) => {
				return res.data;
			})
			.catch(console.error);

		return reqData;
	});

	const addToWatchlist = (id) => {
		Axios.post('/watch_later/add', {
			mal_id: id,
		})
			.then((r) => console.log(r))
			.catch(console.error);
	};
	const alreadyWatched = (id) => {
		Axios.post('/completed/add', {
			mal_id: id,
		})
			.then((r) => console.log(r))
			.catch(console.error);
	};

	const onSwipe = (dir, id) => {
		if (dir === 'right') {
			addToWatchlist(id);
		} else if (dir === 'up') {
			alreadyWatched(id);
		}
	};

	const outOfFrame = (id) => {
		console.log(id + ' left the screen');
	};

	// console.log(data);
	return (
		<>
			<div className="swiping-area">
				{animes?.results?.map((anime) => (
					<TinderCard
						className="tinder-card"
						onSwipe={(dir) => onSwipe(dir, anime.mal_id)}
						onCardLeftScreen={() => outOfFrame(anime.mal_id)}
						preventSwipe={['down']}
					>
						<div
							className="swipable-card"
							style={{
								backgroundImage: `linear-gradient(to top, rgba(85, 105, 133, 0.9), transparent), url('${anime.image_url})`,
							}}
						>
							<div className="badge">{anime.score}</div>
							<div>
								<h2>{anime.title}</h2>
								<span className="badge sqr">{anime.rated}</span>&nbsp; |&nbsp;
								<span> {anime.type}</span>&nbsp; |&nbsp;
								<span>{anime?.start_date?.slice(0, 4)} </span>
								<p>{anime.synopsis}</p>
							</div>
						</div>
					</TinderCard>
				))}
			</div>
		</>
	);
};

export default SwipingArea;

// const alreadyRemoved = [];
// let charactersState = db; // This fixes issues with updating characters state forcing it to use the current state and not the state that was active when the card was created.

// function Advanced() {
// 	const [characters, setCharacters] = useState(db);
// 	const [lastDirection, setLastDirection] = useState();

// 	const swiped = (direction, nameToDelete) => {
// 		console.log('removing: ' + nameToDelete);
// 		setLastDirection(direction);
// 		alreadyRemoved.push(nameToDelete);
// 	};

// 	const outOfFrame = (name) => {
// 		console.log(name + ' left the screen!');
// 		charactersState = charactersState.filter(
// 			(character) => character.name !== name
// 		);
// 		setCharacters(charactersState);
// 	};

// 	const swipe = (dir) => {
// 		const cardsLeft = characters.filter(
// 			(person) => !alreadyRemoved.includes(person.name)
// 		);
// 		if (cardsLeft.length) {
// 			const toBeRemoved = cardsLeft[cardsLeft.length - 1].name; // Find the card object to be removed
// 			const index = db.map((person) => person.name).indexOf(toBeRemoved); // Find the index of which to make the reference to
// 			alreadyRemoved.push(toBeRemoved); // Make sure the next card gets removed next time if this card do not have time to exit the screen
// 			childRefs[index].current.swipe(dir); // Swipe the card!
// 		}
// 	};

// 	return (
// 		<div>
// 			<link
// 				href="https://fonts.googleapis.com/css?family=Damion&display=swap"
// 				rel="stylesheet"
// 			/>
// 			<link
// 				href="https://fonts.googleapis.com/css?family=Alatsi&display=swap"
// 				rel="stylesheet"
// 			/>
// 			<h1>React Tinder Card</h1>
// 			<div className="cardContainer">
// 				{characters.map((character, index) => (
// 					<TinderCard
// 						ref={childRefs[index]}
// 						className="swipe"
// 						key={character.name}
// 						onSwipe={(dir) => swiped(dir, character.name)}
// 						onCardLeftScreen={() => outOfFrame(character.name)}
// 					>
// 						<div
// 							style={{ backgroundImage: 'url(' + character.url + ')' }}
// 							className="card"
// 						>
// 							<h3>{character.name}</h3>
// 						</div>
// 					</TinderCard>
// 				))}
// 			</div>
// 			<div className="buttons">
// 				<button onClick={() => swipe('left')}>Swipe left!</button>
// 				<button onClick={() => swipe('right')}>Swipe right!</button>
// 			</div>
// 			{lastDirection ? (
// 				<h2 key={lastDirection} className="infoText">
// 					You swiped {lastDirection}
// 				</h2>
// 			) : (
// 				<h2 className="infoText">
// 					Swipe a card or press a button to get started!
// 				</h2>
// 			)}
// 		</div>
// 	);
// }
