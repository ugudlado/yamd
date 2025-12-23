import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

// Mock data
const watchlistItems = [
  { id: '1', title: 'Dilwale Dulhania Le Jayenge', status: 'want_to_watch', year: 1995 },
  { id: '2', title: 'Bahubali: The Beginning', status: 'liked', year: 2015 },
]

const statusLabels: Record<string, { label: string; color: string }> = {
  want_to_watch: { label: 'Want to Watch', color: '#3b82f6' },
  watching: { label: 'Watching', color: '#eab308' },
  watched: { label: 'Watched', color: '#22c55e' },
  liked: { label: 'Liked', color: '#ec4899' },
  recommended: { label: 'Recommended', color: '#a855f7' },
}

export default function WatchlistScreen() {
  if (watchlistItems.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="bookmark-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
        <Text style={styles.emptyText}>Start discovering movies to add to your list</Text>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Discover Movies</Text>
          </TouchableOpacity>
        </Link>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{watchlistItems.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {watchlistItems.filter((i) => i.status === 'want_to_watch').length}
          </Text>
          <Text style={styles.statLabel}>To Watch</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {watchlistItems.filter((i) => i.status === 'liked').length}
          </Text>
          <Text style={styles.statLabel}>Liked</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={watchlistItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const status = statusLabels[item.status] || statusLabels.want_to_watch
          return (
            <Link href={`/movie/${item.id}`} asChild>
              <TouchableOpacity style={styles.listItem}>
                <View style={styles.poster}>
                  <Text style={styles.posterLetter}>{item.title.charAt(0)}</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemYear}>{item.year}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                    <Text style={styles.statusText}>{status.label}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            </Link>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#f97316',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f97316',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  poster: {
    width: 48,
    height: 72,
    backgroundColor: '#fed7aa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterLetter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f97316',
    opacity: 0.5,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemYear: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
})
