import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { useState } from 'react'
import { Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

// Mock data
const mockMovies = [
  {
    id: '1',
    title: 'Dilwale Dulhania Le Jayenge',
    year: 1995,
    industry: 'Bollywood',
    rating: 8.1,
  },
  {
    id: '2',
    title: 'Bahubali: The Beginning',
    year: 2015,
    industry: 'Tollywood',
    rating: 8.0,
  },
  {
    id: '3',
    title: '3 Idiots',
    year: 2009,
    industry: 'Bollywood',
    rating: 8.4,
  },
  {
    id: '4',
    title: 'RRR',
    year: 2022,
    industry: 'Tollywood',
    rating: 8.0,
  },
]

export default function DiscoverScreen() {
  const [search, setSearch] = useState('')

  const filteredMovies = mockMovies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#999"
        />
      </View>

      {/* Quick Filters */}
      <View style={styles.filters}>
        {['Bollywood', 'Tollywood', 'Kollywood'].map((industry) => (
          <TouchableOpacity key={industry} style={styles.filterChip}>
            <Text style={styles.filterText}>{industry}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Movie Grid */}
      <FlatList
        data={filteredMovies}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <Link href={`/movie/${item.id}`} asChild>
            <TouchableOpacity style={styles.movieCard}>
              <View style={styles.posterPlaceholder}>
                <Text style={styles.posterText}>{item.title.charAt(0)}</Text>
              </View>
              <View style={styles.movieInfo}>
                <Text style={styles.movieTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <View style={styles.movieMeta}>
                  <Text style={styles.movieYear}>{item.year}</Text>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={12} color="#fbbf24" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>
                <Text style={styles.industry}>{item.industry}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: '#f97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    color: '#fff',
    fontWeight: '600',
  },
  grid: {
    paddingHorizontal: 8,
  },
  movieCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  posterPlaceholder: {
    aspectRatio: 2 / 3,
    backgroundColor: '#fed7aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#f97316',
    opacity: 0.5,
  },
  movieInfo: {
    padding: 12,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  movieMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 12,
    color: '#666',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  industry: {
    fontSize: 11,
    color: '#f97316',
    fontWeight: '500',
  },
})
