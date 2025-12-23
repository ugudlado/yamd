import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

// Mock data
const mockMovie = {
  id: '1',
  title: 'Dilwale Dulhania Le Jayenge',
  titleHindi: 'दिलवाले दुल्हनिया ले जाएंगे',
  year: 1995,
  runtime: 189,
  language: 'Hindi',
  industry: 'Bollywood',
  rating: 8.1,
  votes: 12500,
  plot: "Raj and Simran meet on a Europe trip and fall in love. But Simran's father has already fixed her marriage to his friend's son.",
  cast: [
    { name: 'Shah Rukh Khan', role: 'Lead Actor', character: 'Raj Malhotra' },
    { name: 'Kajol', role: 'Lead Actor', character: 'Simran Singh' },
    { name: 'Aditya Chopra', role: 'Director' },
    { name: 'Jatin-Lalit', role: 'Music Director' },
  ],
}

export default function MovieScreen() {
  const { id } = useLocalSearchParams()
  const movie = mockMovie // In real app, fetch by id

  const formatRuntime = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h}h ${m}m`
  }

  return (
    <ScrollView style={styles.container}>
      {/* Poster */}
      <View style={styles.posterContainer}>
        <View style={styles.poster}>
          <Text style={styles.posterLetter}>{movie.title.charAt(0)}</Text>
        </View>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{movie.industry}</Text>
          </View>
          <View style={[styles.badge, styles.badgeOutline]}>
            <Text style={styles.badgeOutlineText}>{movie.language}</Text>
          </View>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title}>{movie.title}</Text>
        {movie.titleHindi && (
          <Text style={styles.titleHindi}>{movie.titleHindi}</Text>
        )}

        <View style={styles.meta}>
          <View style={styles.rating}>
            <Ionicons name="star" size={20} color="#fbbf24" />
            <Text style={styles.ratingText}>{movie.rating}</Text>
            <Text style={styles.ratingMax}>/10</Text>
          </View>
          <Text style={styles.votes}>{movie.votes.toLocaleString()} votes</Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{movie.year}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{formatRuntime(movie.runtime)}</Text>
          </View>
        </View>

        <Text style={styles.plot}>{movie.plot}</Text>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Add to Watchlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-outline" size={24} color="#f97316" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Cast */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cast & Crew</Text>
        {movie.cast.map((person, index) => (
          <View key={index} style={styles.castItem}>
            <View style={styles.castAvatar}>
              <Text style={styles.castAvatarText}>
                {person.name.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.castInfo}>
              <Text style={styles.castName}>{person.name}</Text>
              <Text style={styles.castRole}>
                {person.character ? `${person.character} (${person.role})` : person.role}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  posterContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fef3c7',
  },
  poster: {
    width: 180,
    height: 270,
    backgroundColor: '#fed7aa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  posterLetter: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#f97316',
    opacity: 0.5,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: '#f97316',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  badgeOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f97316',
  },
  badgeOutlineText: {
    color: '#f97316',
    fontWeight: '600',
    fontSize: 12,
  },
  info: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  titleHindi: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  ratingMax: {
    fontSize: 14,
    color: '#666',
  },
  votes: {
    marginLeft: 16,
    color: '#666',
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: '#666',
  },
  plot: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f97316',
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#f97316',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 24,
    borderTopWidth: 8,
    borderTopColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  castItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  castAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fed7aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  castAvatarText: {
    fontWeight: '600',
    color: '#f97316',
  },
  castInfo: {
    marginLeft: 12,
  },
  castName: {
    fontSize: 16,
    fontWeight: '500',
  },
  castRole: {
    fontSize: 12,
    color: '#666',
  },
})
