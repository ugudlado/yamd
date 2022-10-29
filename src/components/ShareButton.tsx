import { faShare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Movie } from "../interfaces/Movie"

interface ShareButtonProps {
	movie: Movie
}

const ShareButton = (props: ShareButtonProps) => {
	const movie = props.movie

	const share = () => {
		console.log(`Shared movie: ${movie.name}`)
	}

	return (
		<button title='Share' onClick={share}>
			<FontAwesomeIcon icon={faShare} />
		</button>
	)
}

export default ShareButton
