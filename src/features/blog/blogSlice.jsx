import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../utils/firebaseUtil";
import { ref, push, update, get, child } from "firebase/database";
import { toastSuccessNotify } from "../../utils/ToastNotify";

const initialState = {
  currentBlogs: [],
  newBlog: {},
  updateBlog: {},
  status: "idle",
  error: null,
};

//! Firebase'den blog verilerini almak için thunk
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (_, { dispatch, rejectWithValue }) => {
    // const blogRef = ref(db, "blogs/");
    try {
      const blogRef = ref(db);
      const snapshot = await get(child(blogRef, "blogs/"));
      if (snapshot.exists()) {
        const data = snapshot.val();
        let blogs = [];
        for (let id in data) {
          blogs.push({ id, ...data[id] });
        }
        dispatch(setCurrentBlogs(blogs));
        return blogs;
      } else {
        return [];
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }

    //? onValue sürekli dinleme gerçekleştiriyor. Bu redux store mantığına ters geliyor, gerektiği gibi güncellenmiyor
    //? Bunun yerine yukarıda get ile tek seferlik veri alma yapıyoruz.  

    // return new Promise((resolve, reject) => {
    //   onValue(
    //     query(blogRef),
    //     (snapshot) => {
    //       const data = snapshot.val();
    //       let blogs = [];
    //       for (let id in data) {
    //         blogs.push({ id, ...data[id] });
    //       }
    //       dispatch(setCurrentBlogs(blogs)); // Redux store'u güncelle
    //       resolve(blogs);
    //     },
    //     (error) => {
    //       reject(rejectWithValue(error.message));
    //     }
    //   );
    // });
  }
);

//! Blog ekleme işlemleri için thunk
export const addBlog = createAsyncThunk("blogs/addBlog", async (blog) => {
  await push(ref(db, "blogs"), blog);
  toastSuccessNotify("Blog eklendi");
});

//! Blog güncelleme işlemleri için thunk
export const blogUpDate = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, updateBlog }, { getState, dispatch, rejectWithValue }) => {
    try {
      // Blogun Firebase'deki doğru path'ini belirtiyoruz
      const blogRef = ref(db, `blogs/${id}`);

      const { currentBlogs } = getState().blog;

      const updatedData = {
        ...updateBlog,
        updated_date: Date.now(), // Güncellenmiş tarih
      };
      await update(blogRef, updatedData);

      const updatedBlogs = currentBlogs.map((blog) =>
        blog.id === id ? { ...blog, ...updatedData } : blog
      );

      toastSuccessNotify("Blog güncellendi");
      dispatch(setCurrentBlogs(updatedBlogs));

      return updatedData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//! Like/Unlike işlemleri için thunk
export const toggleLike = createAsyncThunk(
  "blogs/toggleLike",
  async (
    { blogId, userEmail, isAlreadyLiked, likedUsers },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const blogRef = ref(db, `blogs/${blogId}`);

      // Redux state'den mevcut blogları al
      const { currentBlogs } = getState().blog;
      const selectedBlog = currentBlogs.find((blog) => blog.id === blogId);

      let updatedLikeCount = selectedBlog.get_like_count;
      let updatedLikedListed = selectedBlog.likedUsers;

      if (!isAlreadyLiked && !likedUsers.includes(userEmail)) {
        // Kullanıcı beğenmemişse beğeni sayısını artır
        updatedLikeCount += 1;
        updatedLikedListed = [...likedUsers, userEmail];
      } else if (isAlreadyLiked && likedUsers.includes(userEmail)) {
        // Kullanıcı daha önce beğendiyse beğeniyi geri al
        updatedLikeCount -= 1;
        updatedLikedListed = likedUsers.filter((user) => user !== userEmail);
      }

      // Firebase'de güncelleme yap
      await update(blogRef, {
        get_like_count: updatedLikeCount,
        likedUsers: updatedLikedListed,
      });

      // Redux state'i güncelle
      const updatedBlogs = currentBlogs.map((blog) =>
        blog.id === blogId
          ? {
              ...blog,
              get_like_count: updatedLikeCount,
              likedUsers: updatedLikedListed,
            }
          : blog
      );

      dispatch(setCurrentBlogs(updatedBlogs));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//! Yorum ekleme işlemleri için thunk
export const blogAddComment = createAsyncThunk(
  "blogs/blogAddComment",
  async ({ id, comment }, { getState, dispatch, rejectWithValue }) => {
    try {
      const blogRef = ref(db, `blogs/${id}`);

      const { currentBlogs } = getState().blog;
      const selectedBlog = currentBlogs.find((blog) => blog.id === id);

      // Mevcut yorumları bir dizi olarak ele alıyoruz, yoksa boş bir dizi kullanıyoruz
      const updatedComments = [...(selectedBlog.comments || []), comment];

      // Yorum sayısını güncelle
      const updatedCommentCount = updatedComments.length;

      // Firebase'e yeni yorumu ekle
      await update(blogRef, {
        comments: updatedComments,
        get_comment_count: updatedCommentCount,
      });

      // Güncellenmiş yorum dizisini blog ile birlikte Redux state'e kaydediyoruz
      const updatedBlogs = currentBlogs.map((blog) =>
        blog.id === id
          ? {
              ...blog,
              comments: updatedComments,
              get_comment_count: updatedCommentCount,
            }
          : blog
      );

      dispatch(setCurrentBlogs(updatedBlogs));
      toastSuccessNotify("Yorum eklendi");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//! Yorum silme
export const deleteComment = createAsyncThunk(
  "blogs/deleteComment",
  async ({ id, commentIndex }, { getState, dispatch, rejectWithValue }) => {
    try {
      const blogRef = ref(db, `blogs/${id}`);
      const { currentBlogs } = getState().blog;
      const selectedBlog = currentBlogs.find((blog) => blog.id === id);

      // Silinecek yorumu çıkartarak yeni yorum dizisini oluştur
      const updatedComments = selectedBlog.comments.filter(
        (_, index) => index !== commentIndex
      );

      // Yeni yorum sayısını güncelle
      const updatedCommentCount = updatedComments.length;

      // Firebase’de yorumu güncelle
      await update(blogRef, {
        comments: updatedComments,
        get_comment_count: updatedCommentCount,
      });

      // Redux store’da blog verisini güncelle
      const updatedBlogs = currentBlogs.map((blog) =>
        blog.id === id
          ? {
              ...blog,
              comments: updatedComments,
              get_comment_count: updatedCommentCount,
            }
          : blog
      );

      dispatch(setCurrentBlogs(updatedBlogs));
      return updatedComments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//! Yorum güncelleme işlemleri için thunk
export const singleBlogCommentUpdate = createAsyncThunk(
  "blogs/updateComment",
  async ({ id, comments }, { getState, dispatch, rejectWithValue }) => {
    try {
      const blogRef = ref(db, `blogs/${id}`);
      const { currentBlogs } = getState().blog;

      await update(blogRef, {
        comments,
      });

      // Güncellenmiş yorum dizisini blog ile birlikte Redux state'e kaydediyoruz
      const updatedBlogs = currentBlogs.map((blog) =>
        blog.id === id
          ? {
              ...blog,
              comments,
            }
          : blog
      );

      dispatch(setCurrentBlogs(updatedBlogs));

      return comments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//! Blog profil ve yorum resimlerini güncelleme
export const blogProfilAvatarUpdate = createAsyncThunk(
  "blogs/updateBlogProfile",
  async ({ authorUrl, userEmail }, { getState, dispatch, rejectWithValue }) => {
    try {
      const { currentBlogs } = getState().blog;

      // Tüm blogları dolaş ve güncelle
      const updatedBlogsUrl = currentBlogs.map((blog) => {
        const blogRef = ref(db, `blogs/${blog.id}`);

        // Blog yazarı kullanıcı ise `author` alanını güncelliyoruz
        let updatedBlog =
          blog.authorEmail === userEmail
            ? { ...blog, authorUrl: authorUrl }
            : blog;

        update(blogRef, {
          authorUrl: updatedBlog.authorUrl,
        });

        // Blogdaki yorumları güncelle
        if (blog.comments?.length > 0) {
          const updatedComments = blog.comments.map((comment) =>
            comment.authorEmail === userEmail
              ? { ...comment, commentAuthorUrl: authorUrl }
              : comment
          );
          update(blogRef, {
            comments: updatedComments,
          });
        }
        return updatedBlog;
      });

      dispatch(setCurrentBlogs(updatedBlogsUrl));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//! Blog profil ve yorum isimlerini güncelleme
export const blogProfilNameUpdate = createAsyncThunk(
  "blogs/updateBlogProfile",
  async (
    { userEmail, authorName },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const { currentBlogs } = getState().blog;

      // Tüm blogları dolaşiyoruz
      const updatedBlogs = currentBlogs.map((blog) => {
        const blogRef = ref(db, `blogs/${blog.id}`);

        // Blog yazarı kullanıcı ise `author` alanını güncelliyoruz
        let updatedBlog =
          blog.authorEmail === userEmail
            ? { ...blog, author: authorName }
            : blog;

        update(blogRef, {
          author: updatedBlog.author,
        });

        // Blogdaki yorumları güncelle
        if (blog.comments?.length > 0) {
          const updatedComments = blog.comments.map((comment) =>
            comment.authorEmail === userEmail
              ? { ...comment, author: authorName }
              : comment
          );
          update(blogRef, {
            comments: updatedComments,
          });
        }
        return updatedBlog;
      });

      // Redux store'u güncelle
      dispatch(setCurrentBlogs(updatedBlogs)); // güncellenmiş blogları redux store'a gönderiyoruz.
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setNewBlog: (state, { payload }) => {
      state.newBlog = payload;
    },
    setCurrentBlogs: (state, { payload }) => {
      state.currentBlogs = payload;
    },

    setStatus: (state, { payload }) => {
      state.status = payload;
    },
    setError: (state, { payload }) => {
      state.error = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogs.fulfilled, (state, { payload }) => {
        state.currentBlogs = payload;
        state.status = "succeeded";
      })
      .addCase(fetchBlogs.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      })
      .addCase(toggleLike.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
      });
  },
});

export const { setNewBlog, setCurrentBlogs, setStatus, setError } =
  blogSlice.actions;

export default blogSlice.reducer;
