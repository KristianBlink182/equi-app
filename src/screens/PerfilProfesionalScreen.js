import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, SafeAreaView, Platform, Share, Modal } from 'react-native';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video';

export default function PerfilProfesionalScreen({ volver, seleccionado, irAChat, irAAgendar }) {
  const [modalVideo, setModalVideo] = useState(false);

  // Reproductor del Video de Presentación
  const videoUrl = seleccionado?.video_url || 'https://sistema.equi.com.pe/videos/demo_presentacion.mp4';
  const player = useVideoPlayer(videoUrl, p => {
    p.loop = true;
    if (modalVideo) p.play();
  });

  const compartir = async () => {
    try {
      await Share.share({
        message: `¡Te recomiendo a ${seleccionado.nombre} (${seleccionado.especialidad}) en la App Equi! 🧠🥗\n\nDescarga la app y agenda tu cita presencial o virtual aquí:\n👉 https://equi.com.pe`,
      });
    } catch (e) {}
  };

  const abrirVideo = () => {
    setModalVideo(true);
    player.play();
  };

  const cerrarVideo = () => {
    player.pause();
    setModalVideo(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={volver} style={{ padding: 6 }}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Perfil Profesional</Text>
        <TouchableOpacity style={{ marginLeft: 'auto', padding: 6 }} onPress={compartir}>
          <Feather name="share-2" size={22} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={styles.profileHeader}>
          {/* FOTO CON ANILLO DE HISTORIA PARA VER VIDEO */}
          <TouchableOpacity onPress={abrirVideo} style={styles.avatarWrapper}>
            <Image source={{ uri: seleccionado.foto_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400' }} style={styles.avatarBig} />
            <View style={styles.playBadge}>
              <Ionicons name="play" size={14} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={abrirVideo} style={styles.btnVerVideo}>
            <Ionicons name="videocam" size={16} color="#3B82F6" />
            <Text style={styles.btnVerVideoText}>Ver Presentación (15s) 🎬</Text>
          </TouchableOpacity>

          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#3B82F6" />
            <Text style={styles.verifiedText}>Especialista Verificado por Equi</Text>
          </View>
          <Text style={styles.perfilNombre}>{seleccionado.nombre}</Text>
          <Text style={styles.perfilEsp}>{seleccionado.especialidad}</Text>
          <Text style={styles.perfilEducacion}>🎓 {seleccionado.educacion}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>⭐ {seleccionado.estrellas}</Text>
            <Text style={styles.statLabel}>{seleccionado.total_resenas} Reseñas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{seleccionado.experiencia_anios}+ Años</Text>
            <Text style={styles.statLabel}>Experiencia</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{seleccionado.distancia_km} km</Text>
            <Text style={styles.statLabel}>Distancia</Text>
          </View>
        </View>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Sobre el especialista</Text>
          <Text style={styles.bioText}>{seleccionado.biografia}</Text>
        </View>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Modalidades de Atención</Text>
          <View style={styles.rowCardsModalidad}>
            <View style={styles.modalidadPill}>
              <FontAwesome5 name="hospital-user" size={16} color="#3B82F6" />
              <Text style={styles.modalidadPillText}>Presencial en Consultorio</Text>
            </View>
            <View style={[styles.modalidadPill, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
              <Ionicons name="videocam" size={18} color="#10B981" />
              <Text style={[styles.modalidadPillText, { color: '#065F46' }]}>Cita Online por Videollamada</Text>
            </View>
          </View>
          <Text style={styles.direccionText}>📍 {seleccionado.direccion}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.btnChatSecundario} onPress={irAChat}>
          <Ionicons name="chatbubbles" size={22} color="#3B82F6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnAgendarPrincipal} onPress={irAAgendar}>
          <Text style={styles.btnAgendarPrincipalText}>Agendar Cita • S/. {seleccionado.precio_consulta}</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL DE VIDEO DE 15 SEGUNDOS CON MARCA DE AGUA */}
      <Modal visible={modalVideo} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.videoModalContainer}>
          <TouchableOpacity style={styles.btnCerrarModal} onPress={cerrarVideo}>
            <Ionicons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>

          <VideoView style={styles.videoPlayer} player={player} contentFit="cover" nativeControls={false} />

          {/* MARCA DE AGUA EQUI EN LA ESQUINA INFERIOR DERECHA */}
          <View style={styles.watermarkBox}>
            <Image source={require('../../assets/logo.png')} style={styles.watermarkLogo} resizeMode="contain" />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  navbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 12 : 20, paddingBottom: 14, borderBottomWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#fff' },
  navbarTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  profileHeader: { alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  avatarWrapper: { position: 'relative', padding: 4, borderRadius: 65, borderWidth: 3, borderColor: '#3B82F6' },
  avatarBig: { width: 110, height: 110, borderRadius: 55 },
  playBadge: { position: 'absolute', bottom: 4, right: 4, backgroundColor: '#3B82F6', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  btnVerVideo: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EFF6FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginTop: 10, marginBottom: 8 },
  btnVerVideoText: { color: '#1D4ED8', fontSize: 13, fontWeight: 'bold' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  verifiedText: { fontSize: 12, color: '#1D4ED8', fontWeight: '600' },
  perfilNombre: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  perfilEsp: { fontSize: 15, color: '#3B82F6', fontWeight: '500', marginTop: 2 },
  perfilEducacion: { fontSize: 13, color: '#6B7280', marginTop: 6 },
  statsContainer: { flexDirection: 'row', backgroundColor: '#fff', marginTop: 8, paddingVertical: 16, justifyContent: 'space-around', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#E5E7EB' },
  sectionBox: { backgroundColor: '#fff', marginTop: 10, padding: 18 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  bioText: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  rowCardsModalidad: { gap: 8, marginVertical: 8 },
  modalidadPill: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#EFF6FF', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#DBEAFE' },
  modalidadPillText: { fontSize: 13, fontWeight: '600', color: '#1E40AF' },
  direccionText: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', gap: 12, borderTopWidth: 1, borderColor: '#E5E7EB' },
  btnChatSecundario: { width: 50, height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },
  btnAgendarPrincipal: { flex: 1, backgroundColor: '#3B82F6', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  btnAgendarPrincipalText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  videoModalContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', position: 'relative' },
  btnCerrarModal: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  videoPlayer: { width: '100%', height: '100%' },
  watermarkBox: { position: 'absolute', bottom: 40, right: 20, opacity: 0.8 },
  watermarkLogo: { width: 100, height: 40 }
});