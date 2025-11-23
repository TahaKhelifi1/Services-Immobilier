import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS, SPACING } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { getColors } from '../../constants/colors';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Property } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useProperties';

const SearchScreen = ({ navigation, route }: any) => {
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites(user?.uid || '');
  const [searchQuery, setSearchQuery] = useState(route.params?.initialQuery || '');
  const [selectedType, setSelectedType] = useState<'all' | 'sale' | 'rent'>('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (route.params?.initialQuery) {
      handleSearch();
    }
  }, []);

  const propertyTypes = ['Tout', 'Appartement', 'Maison', 'Villa', 'Studio', 'Bureau'];
  const bedroomOptions = [1, 2, 3, 4, 5];
  const amenitiesList = ['Parking', 'Piscine', 'Jardin', 'Balcon', 'Ascenseur', 'Climatisation'];

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      let q = query(collection(db, 'properties'));
      const querySnapshot = await getDocs(q);
      let results: Property[] = [];
      
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as Property);
      });

      // Client-side filtering
      results = results.filter(property => {
        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesQuery = 
            property.title?.toLowerCase().includes(query) ||
            property.description?.toLowerCase().includes(query) ||
            property.location?.city?.toLowerCase().includes(query) ||
            property.location?.address?.toLowerCase().includes(query);
          if (!matchesQuery) return false;
        }

        // Type filter
        if (selectedType !== 'all' && property.type !== selectedType) return false;

        // Property type filter
        if (selectedPropertyType !== 'all' && selectedPropertyType !== 'tout') {
          const typeMap: any = {
            'appartement': 'apartment',
            'maison': 'house',
            'villa': 'villa',
            'studio': 'studio',
            'bureau': 'office'
          };
          if (property.propertyType !== typeMap[selectedPropertyType]) return false;
        }

        // Price range filter
        if (priceRange.min && property.price < parseInt(priceRange.min)) return false;
        if (priceRange.max && property.price > parseInt(priceRange.max)) return false;

        // Bedrooms filter
        if (bedrooms && property.bedrooms < bedrooms) return false;

        // Bathrooms filter
        if (bathrooms && property.bathrooms < bathrooms) return false;

        // Amenities filter
        if (selectedAmenities.length > 0) {
          const hasAllAmenities = selectedAmenities.every(amenity => 
            property.amenities?.includes(amenity)
          );
          if (!hasAllAmenities) return false;
        }

        return true;
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedPropertyType('all');
    setPriceRange({ min: '', max: '' });
    setBedrooms(null);
    setBathrooms(null);
    setSelectedAmenities([]);
    setSearchResults([]);
    setSearched(false);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleToggleFavorite = async (propertyId: string, e: any) => {
    e.stopPropagation();
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    try {
      await toggleFavorite(propertyId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const renderPropertyCard = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={[styles.resultCard, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('PropertyDetails', { id: item.id })}
    >
      <Image
        source={{ uri: item.images?.[0] || 'https://ui-avatars.com/api/?name=Property&size=400' }}
        style={styles.resultImage}
      />
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={(e) => handleToggleFavorite(item.id, e)}
      >
        <Ionicons 
          name={isFavorite(item.id) ? "heart" : "heart-outline"} 
          size={24} 
          color={isFavorite(item.id) ? COLORS.accent : COLORS.white} 
        />
      </TouchableOpacity>
      <View style={styles.resultInfo}>
        <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={colors.textLight} />
          <Text style={[styles.locationText, { color: colors.textLight }]} numberOfLines={1}>{item.location?.city}</Text>
        </View>
        <View style={styles.resultDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="bed-outline" size={16} color={COLORS.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>{item.bedrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="water-outline" size={16} color={COLORS.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>{item.bathrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="expand-outline" size={16} color={COLORS.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>{item.area}m²</Text>
          </View>
        </View>
        <Text style={[styles.resultPrice, { color: COLORS.primary }]}>{item.price?.toLocaleString()} DH</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Recherche avancée</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={[styles.resetText, { color: COLORS.primary }]}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Ville, quartier ou code postal..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Type de transaction</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[styles.typeButton, { backgroundColor: colors.card, borderColor: colors.border }, selectedType === 'all' && styles.typeButtonActive]}
              onPress={() => setSelectedType('all')}
            >
              <Text style={[styles.typeText, { color: colors.text }, selectedType === 'all' && styles.typeTextActive]}>
                Tout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, { backgroundColor: colors.card, borderColor: colors.border }, selectedType === 'sale' && styles.typeButtonActive]}
              onPress={() => setSelectedType('sale')}
            >
              <Text style={[styles.typeText, { color: colors.text }, selectedType === 'sale' && styles.typeTextActive]}>
                Vente
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, { backgroundColor: colors.card, borderColor: colors.border }, selectedType === 'rent' && styles.typeButtonActive]}
              onPress={() => setSelectedType('rent')}
            >
              <Text style={[styles.typeText, { color: colors.text }, selectedType === 'rent' && styles.typeTextActive]}>
                Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Type de propriété</Text>
          <View style={styles.propertyTypeContainer}>
            {propertyTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.propertyTypeChip,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  selectedPropertyType === type.toLowerCase() && styles.propertyTypeChipActive
                ]}
                onPress={() => setSelectedPropertyType(type.toLowerCase())}
              >
                <Text
                  style={[
                    styles.propertyTypeText,
                    { color: colors.text },
                    selectedPropertyType === type.toLowerCase() && styles.propertyTypeTextActive
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Fourchette de prix (€)</Text>
          <View style={styles.priceRow}>
            <View style={[styles.priceInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Min"
                value={priceRange.min}
                onChangeText={(text) => setPriceRange({ ...priceRange, min: text })}
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
              />
            </View>
            <Text style={[styles.priceSeparator, { color: colors.text }]}>-</Text>
            <View style={[styles.priceInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Max"
                value={priceRange.max}
                onChangeText={(text) => setPriceRange({ ...priceRange, max: text })}
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Chambres</Text>
          <View style={styles.optionsRow}>
            {bedroomOptions.map((num) => (
              <TouchableOpacity
                key={num}
                style={[styles.optionButton, { backgroundColor: colors.card, borderColor: colors.border }, bedrooms === num && styles.optionButtonActive]}
                onPress={() => setBedrooms(bedrooms === num ? null : num)}
              >
                <Text style={[styles.optionText, { color: colors.text }, bedrooms === num && styles.optionTextActive]}>
                  {num}+
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Salles de bain</Text>
          <View style={styles.optionsRow}>
            {[1, 2, 3, 4].map((num) => (
              <TouchableOpacity
                key={num}
                style={[styles.optionButton, { backgroundColor: colors.card, borderColor: colors.border }, bathrooms === num && styles.optionButtonActive]}
                onPress={() => setBathrooms(bathrooms === num ? null : num)}
              >
                <Text style={[styles.optionText, { color: colors.text }, bathrooms === num && styles.optionTextActive]}>
                  {num}+
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {amenitiesList.map((amenity) => (
              <TouchableOpacity 
                key={amenity} 
                style={[
                  styles.amenityChip,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  selectedAmenities.includes(amenity) && styles.amenityChipActive
                ]}
                onPress={() => toggleAmenity(amenity)}
              >
                <Text style={[
                  styles.amenityText,
                  { color: colors.text },
                  selectedAmenities.includes(amenity) && styles.amenityTextActive
                ]}>{amenity}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {searched && (
          <View style={styles.resultsSection}>
            <Text style={[styles.resultsTitle, { color: colors.text }]}>
              {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
            </Text>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderPropertyCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.resultsList}
              />
            ) : (
              <View style={styles.emptyResults}>
                <Ionicons name="search-outline" size={64} color={colors.textLight} />
                <Text style={[styles.emptyText, { color: colors.text }]}>No properties found</Text>
                <Text style={[styles.emptySubtext, { color: colors.textLight }]}>Try adjusting your filters</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="search" size={24} color={COLORS.white} />
              <Text style={styles.searchButtonText}>Search</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  resetText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.padding,
    marginVertical: 16,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.text,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: SIZES.padding,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  typeText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  typeTextActive: {
    color: COLORS.white,
  },
  propertyTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  propertyTypeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  propertyTypeChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  propertyTypeText: {
    fontSize: 14,
    color: COLORS.text,
  },
  propertyTypeTextActive: {
    color: COLORS.white,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  priceSeparator: {
    fontSize: 20,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  optionButtonActive: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  optionTextActive: {
    color: COLORS.white,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  amenityText: {
    fontSize: 14,
    color: COLORS.text,
  },
  footer: {
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? SIZES.bottomSpace + SPACING.lg : SPACING.lg,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    borderRadius: SIZES.radius,
    minHeight: 50,
    gap: SPACING.sm,
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  amenityChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  amenityTextActive: {
    color: COLORS.white,
  },
  resultsSection: {
    marginTop: 16,
    paddingHorizontal: SIZES.padding,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  resultsList: {
    paddingBottom: 100,
  },
  resultCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  resultImage: {
    width: '100%',
    height: 180,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultInfo: {
    padding: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 4,
    flex: 1,
  },
  resultDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.text,
  },
  resultPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  loader: {
    marginVertical: 32,
  },
  emptyResults: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
  },
});

export default SearchScreen;
