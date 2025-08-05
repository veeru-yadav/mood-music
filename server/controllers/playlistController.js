import Playlist from "../models/Playlist.js";
import User from "../models/User.js";
import Music from "../models/Music.js";

// Create a new playlist
export const createPlaylist = async (req, res) => {
  try {
    const { name, musicIds } = req.body;
    const userId = req.user._id;

    const playlist = new Playlist({
      name,
      user: userId,
      musics: musicIds || [],
    });

    await playlist.save();

    // Update user's playlist list
    await User.findByIdAndUpdate(userId, {
      $push: { playlists: playlist._id },
    });

    res.status(201).json({ message: "Playlist created", playlist });
  } catch (error) {
    res.status(500).json({ error: "Failed to create playlist" });
  }
};

// Get all playlists of a user
export const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user._id;

    const playlists = await Playlist.find({ user: userId }).populate("musics");
    res.status(200).json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Failed to get playlists" });
  }
};

// Add music to a playlist
export const addMusicToPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { musicId } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
    const music = await Music.findById(musicId);
    if (!music) return res.status(404).json({ error: "Music not found" });

    if (!playlist.musics.includes(musicId)) {
      playlist.musics.push(musicId);
      await playlist.save();
    }

    res.status(200).json({ message: "Music added to playlist", playlist });
  } catch (error) {
    res.status(500).json({ error: "Failed to add music to playlist" });
  }
};

// Remove music from playlist
export const removeMusicFromPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { musicId } = req.body;

    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $pull: { musics: musicId } },
      { new: true }
    );

    if (!playlist) return res.status(404).json({ error: "Playlist not found" });

    res.status(200).json({ message: "Music removed from playlist", playlist });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove music" });
  }
};

// Delete playlist
export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user._id;

    const playlist = await Playlist.findOneAndDelete({ _id: playlistId, user: userId });

    if (!playlist) return res.status(404).json({ error: "Playlist not found" });

    // Remove from user's playlists
    await User.findByIdAndUpdate(userId, {
      $pull: { playlists: playlistId },
    });

    res.status(200).json({ message: "Playlist deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete playlist" });
  }
};

