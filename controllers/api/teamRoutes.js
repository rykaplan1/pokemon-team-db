const router = require('express').Router();
const { User, Team, Pokemon } = require('../../models');

// GET for all teams in db
router.get('/', async (req, res) => {
  try {
    const dbTeamData = await Team.findAll({ include: [{ model: User, attributes: { exclude: 'password' } }, { model: Pokemon }] });
    const teams = dbTeamData.map(team => team.get({ plain: true }));

    if (!teams) {
      res.status(404).json({ message: 'No team found in the database!' });
      return;
    };

    res.status(200).json(teams);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };
});

// GET for team by the teams id
router.get('/:id', async (req, res) => {
  try {
    const dbTeamData = await Team.findByPk(req.params.id, { include: [{ model: User, attributes: { exclude: 'password' } }, { model: Pokemon }] });
    const team = dbTeamData.get({ plain: true });

    if (!team) {
      res.status(404).json({ message: 'No team found with this id!' });
      return;
    };

    res.status(200).json(team);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };
});

// GET for team by logged in user
// TODO: Add withAuth after testing with insomnia
router.get('/my_teams/:id', async (req, res) => {
  try {
    const dbTeamData = await Team.findAll({ where: { user_id: req.params.id }, include: { model: Pokemon } });
    const teams = dbTeamData.map(team => team.get({ plain: true }));

    if (!teams) {
      res.status(404).json({ message: 'No team found in the database!' });
      return;
    };

    res.status(200).json(teams);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };
});

// POST for user to add team
// TODO: Add withAuth after testing with insomnia
router.post('/', async (req, res) => {
  try {
    const newTeam = await Team.create({
      team_name: req.body.team_name,
      game: req.body.game,
      user_id: req.session.userId
    });

    res.status(200).json(newTeam);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };
});

// PUT for updating a team
// TODO: Add withAuth after testing with insomnia
router.put('/:id', async (req, res) => {
  try {
    const updatedTeam = await Team.update({
      team_name: req.body.team_name
    },
      {
        where: {
          id: req.params.id,

          // TODO: Commented out for testing, uncomment for final testing and deployment
          // user_id: req.session.user_id,
        }
      });

    if (!updatedTeam) {
      res.status(404).json({ message: 'No team found with this id!' });
      return;
    };

    res.status(200).json(updatedTeam);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };
});

// DELETE for removing a team
// TODO: Add withAuth after testing with insomnia
router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.destroy({
      where: {
        id: req.params.id,

        // TODO: Commented out for testing, uncomment for final testing and deployment
        // user_id: req.session.user_id,
      }
    });

    if (!team) {
      res.status(404).json({ message: 'No team found with this id!' });
      return;
    };

    res.status(200).json(team);
  } catch (err) {
    res.status(500).json(err);
  };
});

module.exports = router;
