import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Appearance,
  SafeAreaView,
  FlatList,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import moment from "moment";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import he from "he";

import postProviders from "../constants/postProviders";

const API_URL = "https://startupnews.fyi/wp-json/wp/v2/posts?_embed";
const POSTS_PER_PAGE = 10;

export default function MenuScreen() {
  const colorScheme = Appearance.getColorScheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);

  const flatListRef = useRef(null); // Reference to FlatList

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (newPage = 1) => {
    if (!hasMore && newPage !== 1) return;

    try {
      if (newPage === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(
        `${API_URL}&page=${newPage}&per_page=${POSTS_PER_PAGE}`
      );
      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPosts(newPage === 1 ? data : [...posts, ...data]);
        setPage(newPage);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMorePosts = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1);
    }
  };

  const openWebView = (url) => {
    setWebViewUrl(url);
    setWebViewVisible(true);
  };

  // Handle scroll visibility
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollButton(offsetY > 300); // Show button after scrolling 300px
  };

  // Scroll to top function
  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>Latest Posts</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <>
          <FlatList
            ref={flatListRef} // Attach ref
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.contentContainer}
            renderItem={({ item }) => (
              <PostCard post={item} openWebView={openWebView} />
            )}
            onEndReached={loadMorePosts}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : null
            }
            onScroll={handleScroll} // Track scrolling
            scrollEventThrottle={16} // Optimize performance
          />

          {/* Scroll to Top Button */}
          {showScrollButton && (
            <TouchableOpacity
              style={styles.scrollTopButton}
              onPress={scrollToTop}
            >
              <Ionicons name="arrow-up-circle" size={40} color="white" />
            </TouchableOpacity>
          )}
        </>
      )}

      {/* WebView Modal */}
      <Modal
        visible={webViewVisible}
        animationType="slide"
        onRequestClose={() => setWebViewVisible(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setWebViewVisible(false)}>
              <Ionicons name="close-circle" size={30} color="red" />
            </TouchableOpacity>
          </View>
          <WebView source={{ uri: webViewUrl }} />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const PostCard = ({ post, openWebView }) => {
  const featuredImage =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";

  const extractSourceLink = (content) => {
    const match = content.match(/<a href="(.*?)"[^>]*>Source link <\/a>/);
    return match ? match[1] : post.link;
  };

  const sourceLink = extractSourceLink(post.content.rendered);

  const postProvider =
    postProviders.find((provider) => sourceLink.includes(provider.url)) ||
    postProviders[0];

  console.log(postProvider);

  const category =
    post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Uncategorized";
  const timeAgo = moment(post.date).fromNow();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openWebView(sourceLink)}
    >
      {featuredImage && (
        <Image source={{ uri: featuredImage }} style={styles.image} />
      )}
      <View style={styles.textContainer}>
        <View style={styles.metaContainer}>
          <View style={styles.flex}>
            <Image
              source={{
                uri: postProvider.avatar,
              }}
              style={styles.postProvider}
            />
            <View>
              <Text style={styles.category}>{postProvider.name}</Text>
              <Text style={styles.timeAgo}>{timeAgo}</Text>
            </View>
          </View>

          <Text style={styles.category}>{category}</Text>
        </View>
        {/* Decode HTML entities before displaying */}
        <Text style={styles.title}>{he.decode(post.title.rendered)}</Text>
        <Text style={styles.excerpt}>
          {he
            .decode(post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, ""))
            .slice(0, 100)}
          ...
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  postProvider: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
  },
  flex: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  textContainer: {
    padding: 10,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  category: {
    fontSize: 14,
    color: "#ff9800",
    fontWeight: "bold",
  },
  timeAgo: {
    fontSize: 14,
    color: "#aaa",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  excerpt: {
    fontSize: 14,
    color: "#bbbbbb",
    marginTop: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
    backgroundColor: "#fff",
  },
  scrollTopButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
