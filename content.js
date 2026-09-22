// Media and interaction examples.
window.LEADVLA_CONTENT = {
  media: {
    baselineComparison: { src: 'media/baseline-comparison.mp4', poster: 'assets/images/baseline-comparison.webp', aspectRatio: '8 / 3', title: 'Closed-loop rollout comparison of LeadVLA and representative robot-leading policies' },
    teaser: { src: 'media/teaser.mp4', poster: 'assets/images/teaser.webp', version: 'overview-v1', title: 'LeadVLA overview', muted: false, autoplay: true },
    benchCoreSingle: { src: 'media/bench-core-s.mp4', poster: 'assets/images/bench-core-s.webp', aspectRatio: '4 / 3', title: 'Core single-person scenario preview with steady following' },
    benchEasySingle: { src: 'media/bench-easy-s.mp4', poster: 'assets/images/bench-easy-s.webp', aspectRatio: '4 / 3', title: 'Easy single-person scenario preview with steady following' },
    benchConstrainedSingle: { src: 'media/bench-constrained-s.mp4', poster: 'assets/images/bench-constrained-s.webp', aspectRatio: '4 / 3', title: 'Constrained single-person scenario preview with steady following' },
    benchCoreMulti: { src: 'media/bench-core-m.mp4', poster: 'assets/images/bench-core-m.webp', aspectRatio: '4 / 3', title: 'Core multi-person scenario preview with steady following' },
    benchEasyMulti: { src: 'media/bench-easy-m.mp4', poster: 'assets/images/bench-easy-m.webp', aspectRatio: '4 / 3', title: 'Easy multi-person scenario preview with steady following' },
    benchConstrainedMulti: { src: 'media/bench-constrained-m.mp4', poster: 'assets/images/bench-constrained-m.webp', aspectRatio: '4 / 3', title: 'Constrained multi-person scenario preview with steady following' },
    realSingle: { src: 'media/real-single.mp4', poster: 'assets/images/real-single.webp', title: 'Pause, wait, and resume with the designated follower' },
    realReferentGray: { src: 'media/real-referent-gray.mp4', poster: 'assets/images/real-referent-gray.webp', title: 'Lead the follower in a gray shirt and black shorts' },
    realReferentWhite: { src: 'media/real-referent-white.mp4', poster: 'assets/images/real-referent-white.webp', title: 'Lead the follower in a white T-shirt and gray trousers' },
    realObstacle: { src: 'media/real-obstacle.mp4', poster: 'assets/images/real-obstacle.webp', title: 'Local obstacle avoidance while responding to the designated follower' }
  },
  realTasks: [
    { id: 'coffee', src: 'media/real-coffee.mp4', poster: 'assets/images/real-coffee.webp', title: 'Complete leading task in a coffee shop' },
    { id: 'terminal', src: 'media/real-terminal.mp4', poster: 'assets/images/real-terminal.webp', title: 'Complete leading task in an airport terminal' }
  ],
  cases: {
    motion: [
      { id: 'steady_track', title: 'Steady tracking', description: 'The designated follower maintains a steady walking pace.', observation: 'Continuous progress along the route with a stable robot–follower relation.' },
      { id: 'mild_lag', title: 'Mild lag', description: 'The follower gradually falls slightly behind the robot.', observation: 'A gradual pace adjustment as separation grows.' },
      { id: 'persistent_lag', title: 'Persistent lag', description: 'The follower remains behind for a sustained period.', observation: 'Stronger slowdown or waiting as the separation persists.' },
      { id: 'stop_recover', title: 'Stop & recover', description: 'The follower stops for an extended period, then resumes and catches up.', observation: 'The transition from leading to waiting, followed by renewed route progress.' },
      { id: 'short_pause', title: 'Short pause', description: 'The follower briefly pauses before continuing.', observation: 'A limited slowdown in response to the realized interaction.' },
      { id: 'gradual_slowdown', title: 'Gradual slowdown', description: 'The follower continuously reduces walking speed.', observation: 'Smooth adaptation as the relative distance changes over time.' },
      { id: 'multi_hesitate', title: 'Repeated hesitation', description: 'The follower alternates between lagging and recovering.', observation: 'Repeated pace adjustments across a temporally extended interaction.' },
      { id: 'start_failure', title: 'Start failure', description: 'The designated follower does not begin following after task onset.', observation: 'Stopping and waiting instead of continuing alone.' }
    ],
    presence: [
      { id: 'normal_visible', title: 'Continuously visible', description: 'The designated follower remains observable throughout the interaction.', observation: 'Stable visual contact in the rear-view stream.' },
      { id: 'temporary_occlusion', title: 'Temporary occlusion', description: 'Scene geometry briefly hides the follower from view.', observation: 'A short visibility interruption and subsequent recovery.' },
      { id: 'stationary_fall_behind', title: 'Stationary fall-behind', description: 'The follower stops while separation initially increases.', observation: 'How realized separation and visibility affect execution.' },
      { id: 'empty_rear_wait_reacquire', title: 'Loss & reacquisition', description: 'The rear view becomes empty and the target later returns.', observation: 'Waiting through target absence and recovering after reacquisition.' },
      { id: 'target_absent_distractor_visible', title: 'Only distractor visible', description: 'The designated follower leaves view while another person remains visible.', observation: 'A visible distractor does not replace the missing target.' }
    ],
    formation: [
      { id: 'near', title: 'Near distance', description: 'The instruction asks the robot to keep the designated follower nearby.', observation: 'The shorter robot–follower gap as the pair moves along the route.' },
      { id: 'far', title: 'Far distance', description: 'The instruction asks for more space between the robot and the follower.', observation: 'A larger following distance than in the near-distance case.' },
      { id: 'left', title: 'Left formation', description: 'The designated follower is requested to stay on the robot’s left side.', observation: 'The lateral offset in the route view and the follower’s bearing relative to the robot.' },
      { id: 'center', title: 'Center formation', description: 'The designated follower is requested to stay centered behind the robot.', observation: 'The follower stays near the center of the rear view as the robot advances.' },
      { id: 'right', title: 'Right formation', description: 'The designated follower is requested to stay on the robot’s right side.', observation: 'Compare the lateral offset and target bearing with the left-formation case.' }
    ],
    target: [
      { id: 'a_to_b', title: 'Switch from Target A to Target B', description: 'The language instruction is updated to designate Target B while both people remain in the scene and the planned route stays unchanged.', observation: 'After the switch, the robot responds to Target B’s motion. Target A remains visible but no longer determines the response.' }
    ],
    actors: [
      { id: 'appearance', asset: 'appearance', aspectRatio: '16 / 9', loop: true, title: 'Different appearances. The same interaction space.', description: 'Combine body shapes, clothing, accessories, and scale to create 756 human appearance configurations for followers and distractors.', observation: 'Clothing and accessories change across the actors, providing varied appearance cues for language-based target designation.' }
    ]
  }
};
