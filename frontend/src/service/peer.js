class PeerService {
  constructor() {
    // Check if PeerConnection is already created
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });

      // Collect ICE Candidates and send to the remote peer
      this.candidates = [];
      this.peer.onicecandidate = (event) => {
        if (event.candidate) {
          this.candidates.push(event.candidate);
        }
      };

      // Handle connection state changes for debugging
      this.peer.onconnectionstatechange = () => {
        console.log("Connection State: ", this.peer.connectionState);
      };
    }
  }

  // Create an Offer
  async getOffer() {
    try {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("Error creating offer: ", error);
    }
  }

  // Create an Answer for the received Offer
  async getAnswer(offer) {
    try {
      await this.peer.setRemoteDescription(offer);
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error("Error creating answer: ", error);
    }
  }

  // Set the Local Description
  async setLocalDescription(description) {
    try {
      await this.peer.setLocalDescription(description);
    } catch (error) {
      console.error("Error setting local description: ", error);
    }
  }

  // Set the Remote Description
  async setRemoteDescription(description) {
    try {
      await this.peer.setRemoteDescription(description);
    } catch (error) {
      console.error("Error setting remote description: ", error);
    }
  }

  // Add ICE Candidate
  async addIceCandidate(candidate) {
    try {
      await this.peer.addIceCandidate(candidate);
    } catch (error) {
      console.error("Error adding ICE candidate: ", error);
    }
  }

  // Get all ICE Candidates gathered so far
  getIceCandidates() {
    return this.candidates;
  }
}

export default new PeerService();
