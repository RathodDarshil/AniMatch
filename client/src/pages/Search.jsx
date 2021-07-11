import Axios from 'axios';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';

const uninterceptedAxios = Axios.create();

export const Search = () => {
	const [query, setQuery] = useState('');
	let { data: animes, refetch } = useQuery(
		'animeData',
		async function getData() {
			const payload = {
				params: {
					q: query,
				},
			};

			const reqData = await uninterceptedAxios
				.get('https://api.jikan.moe/v3/search/anime', payload)
				.then((res) => {
					return res.data;
				})
				.catch(console.log);

			return reqData;
		}
	);

	useEffect(() => {
		if (query.length >= 3) refetch();
	}, [query]);

	return (
		<div className="container">
			<input
				type="search"
				name="search"
				placeholder="Search for Anime, Manga, Comics and more..."
				value={query}
				style={{ width: '100%' }}
				onChange={(e) => setQuery(e.target.value)}
			/>
			<div id="search-results">
				{animes?.results?.map((anime) => (
					<div
						className="search-card"
						style={{
							backgroundImage: `linear-gradient(to top, rgba(85, 105, 133, 0.9), transparent), url('${anime.image_url})`,
						}}
					>
						<div className="badge">{anime.score}</div>
						<div>
							<h3>{anime.title}</h3>
							<span className="badge sqr">{anime.rated}</span>&nbsp; |&nbsp;
							<span> {anime.type}</span>&nbsp; |&nbsp;
							<span>{anime?.start_date?.slice(0, 4)} </span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
