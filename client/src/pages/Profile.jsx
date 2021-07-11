import Axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Context from '../Context';

const uninterceptedAxios = Axios.create();

export const Profile = () => {
	const { user } = useContext(Context);
	const [watchlist, setWatchlist] = useState([]);
	const [watched, setWatched] = useState([]);
	const getWatchlist = () => {
		Axios.get('/watch_later/all')
			.then((r) => {
				// console.log(r);
				r.data.data.forEach((ani) => {
					uninterceptedAxios
						.get(`https://api.jikan.moe/v3/anime/${ani.mal_id}`)
						.then((r) => setWatchlist([...watchlist, r.data]));
				});
			})
			.catch(console.error);
	};
	const getWatched = () => {
		Axios.get('/completed/all')
			.then((r) => {
				// console.log(r);
				r.data.data.forEach((ani) => {
					uninterceptedAxios
						.get(`https://api.jikan.moe/v3/anime/${ani.mal_id}`)
						.then((r) => setWatched([...watched, r.data]));
				});
			})
			.catch(console.error);
	};

	useEffect(() => {
		getWatchlist();
		getWatched();
	}, []);

	return (
		<div className="contianer" id="profile-section">
			<img src={user.photo} alt="" />
			<h2>
				{user.firstname} {user.lastname}
			</h2>
			<ul id="anime-list">
				<h4>Watchlist</h4>
				{watchlist.map((ani, key) => (
					<li key={ani.id}>
						<h5>{ani.title}</h5>
					</li>
				))}
			</ul>
			<hr />
			<ul id="anime-list">
				<h4>Watched</h4>
				{watched.map((ani, key) => (
					<li key={ani.id} style={{ borderColor: 'var(--grey)' }}>
						<h5>{ani.title}</h5>
					</li>
				))}
			</ul>
		</div>
	);
};
