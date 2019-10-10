export function getArtists(artists = []) {
    let text = ''
    artists.forEach((artist, i) => {
        return text += `${artist.name}${i !== artists.length - 1 ? '/' : ''}`
    })
    return text
}
