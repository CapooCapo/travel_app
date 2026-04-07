package com.example.mobileApp.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class OsmTagMapper {

    private final Map<String, Set<String>> interestToOsmTags = new HashMap<>();

    public OsmTagMapper() {
        // Broad mappings: Interest Name -> Set of Overpass Tags
        // Note: Using ~ for regex matches in Overpass is often better, but here we provide specific keys and values.
        
        interestToOsmTags.put("Culture", Set.of(
            "tourism=museum", "tourism=gallery", "tourism=arts_centre", 
            "amenity=theatre", "amenity=cinema", "amenity=library",
            "historic=monument", "historic=memorial", "amenity=place_of_worship"
        ));
        
        interestToOsmTags.put("History", Set.of(
            "historic=monument", "historic=memorial", "historic=castle", 
            "historic=ruins", "historic=archaeological_site", "tourism=museum",
            "heritage=1", "heritage=2"
        ));
        
        interestToOsmTags.put("Photography", Set.of(
            "tourism=viewpoint", "tourism=attraction", "natural=peak",
            "natural=water", "historic=castle", "tourism=gallery"
        ));
        
        interestToOsmTags.put("Food", Set.of(
            "amenity=restaurant", "amenity=cafe", "amenity=bar", 
            "amenity=pub", "amenity=food_court", "amenity=fast_food",
            "shop=bakery", "shop=confectionery"
        ));
        
        interestToOsmTags.put("Nature", Set.of(
            "leisure=park", "leisure=nature_reserve", "natural=wood", 
            "natural=water", "natural=beach", "tourism=viewpoint",
            "leisure=garden", "landuse=forest"
        ));

        interestToOsmTags.put("Shopping", Set.of(
            "shop=mall", "shop=supermarket", "shop=clothes",
            "shop=fashion", "shop=electronics", "amenity=marketplace"
        ));
    }

    /**
     * Map a set of interest names to a set of Overpass QL tag strings.
     */
    public Set<String> mapInterestsToTags(Set<String> interestNames) {
        if (interestNames == null || interestNames.isEmpty()) {
            // Default broad POIs if no interest
            return Set.of(
                "tourism=attraction", 
                "tourism=museum", 
                "tourism=viewpoint",
                "amenity=restaurant", 
                "amenity=cafe",
                "leisure=park",
                "leisure=garden",
                "historic=monument",
                "historic=memorial",
                "historic=castle",
                "historic=archaeological_site"
            );
        }
        
        return interestNames.stream()
                .filter(interestToOsmTags::containsKey)
                .flatMap(interest -> interestToOsmTags.get(interest).stream())
                .collect(java.util.stream.Collectors.toSet());
    }
}
