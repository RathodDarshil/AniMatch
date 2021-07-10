import TinderCard from 'react-tinder-card';

export const Home = () => {
	const onSwipe = (direction) => {
		console.log('You swiped: ' + direction);
	};

	const onCardLeftScreen = (myIdentifier) => {
		console.log(myIdentifier + ' left the screen');
	};

	return (
		<TinderCard
			onSwipe={onSwipe}
			onCardLeftScreen={() => onCardLeftScreen('fooBar')}
			preventSwipe={['right', 'left']}
		>
			Hello, World!
		</TinderCard>
	);
};
