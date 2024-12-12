import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth } from "../../utils/firebaseUtil";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import {
  toastErrorNotify,
  toastSuccessNotify,
  toastWarnNotify,
} from "../../utils/ToastNotify";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, username }, { rejectWithValue }) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Kullanıcının profilini güncelleme
      updateProfile(user, { displayName: username });
      
      // Update Redux state
      const userData = {
        displayName: username,
        email: user.email,
        photoURL: user.photoURL || null,
      };
      toastSuccessNotify(`Kayıt Başarılı, Hoşgeldiniz ${username}`);
      return userData;
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toastWarnNotify("Bu e-posta adresi zaten kullanımda");
      } else {
        toastErrorNotify(error.code);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password },{ rejectWithValue }) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      const userData = {
        displayName: user.displayName || null,
        email: user.email,
        photoURL: user.photoURL || null,
      };

      // toastSuccessNotify(`Hoşgeldiniz ${auth.currentUser?.displayName}`);
      toastSuccessNotify(`Hoşgeldiniz ${user?.displayName}`);

      return userData;
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        toastWarnNotify("Geçersiz kimlik bilgileri");
      } else {
        toastErrorNotify(error.code);
      }
      return rejectWithValue(error.message); // koymadığında, bir hatalı giriş denemesinde loading true olarak kalıyor.
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    await signOut(auth);
    toastSuccessNotify("Çıkış başarılı");
    return null;
  } catch (error) {
    toastErrorNotify("Çıkış başarısız");
  }
});

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      toastSuccessNotify(`Hoşgeldiniz ${auth.currentUser?.displayName || ""}`);

      const userData = {
        displayName: user.displayName || null,
        email: user.email,
        photoURL: user.photoURL || null,
      };

      return userData;
    } catch (error) {
      toastErrorNotify(error.message);
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload; // sonradan .user ekledim
      state.loading = payload.loading; // bu kısmıda sonradan ekledim
    },
    updateUserAvatar: (state, { payload }) => {
      if (state.user) {
        state.user.photoURL = payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        const { displayName, email, photoURL } = payload;
        state.user = { displayName, email, photoURL };
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        const { displayName, email, photoURL } = payload;
        state.user = { displayName, email, photoURL };
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(logoutUser.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, { payload }) => {
        state.user = payload;
      });
  },
});

export const { setUser, updateUserAvatar } = authSlice.actions;

export default authSlice.reducer;
